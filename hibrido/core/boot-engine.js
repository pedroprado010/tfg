const mongoose = require('mongoose');
const configs = require('./configs');
const is_command = require('./validators/is-command');
const { cache } = require('./global-commands/register');
const {
  CREATE_MODEL,
  DEPENDS_ON_MODEL,
  CREATE_ROUTE,
  CREATE_MIDDLEWARE,
  DEPENDS_ON_MIDDLEWARE,
} = require('./global-commands/action-types');
const { pre_create_model_cache } = require('./global-commands/model-commands');

mongoose.connect(
  'mongodb://mongo:27017/tfg-db',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db');
    }
  }
);

function boot() {
  const generators = cache.map(f => ({ gen: f(), args: null, context: {} }));
  let waiting_models = [];
  let waiting_mids = [];
  let _nxt = null;

  const find_deps_model = (acc, curr) => {
    if (acc && configs.models.has(curr)) acc[curr] = configs.models.get(curr);
    else acc = null;
    return acc;
  };

  const find_deps_mids = (acc, curr) => {
    if (acc && configs.middlewares.has(curr))
      acc[curr] = configs.middlewares.get(curr);
    else acc = null;
    return acc;
  };

  while (generators.length) {
    let { gen, args, context } = generators.pop();
    _nxt = gen.next(args);
    // Não há mais ações, registro pronto
    if (_nxt.done) continue;

    if (is_command(_nxt.value)) {
      switch (_nxt.value.action) {
        case CREATE_MODEL: {
          const { name, schema, statics } = _nxt.value.payload;
          console.log(`CREATING MODEL - ${name}`);
          if (pre_create_model_cache.has(name)) {
            pre_create_model_cache.get(name).forEach(hook => {
              hook(schema, statics);
            });
          }
          const mongoose_schema = new mongoose.Schema(schema);

          !!statics && (mongoose_schema.statics = statics);

          args = mongoose.model(name, mongoose_schema);
          configs.models.set(name, args);
          context[name] = args;

          waiting_models = waiting_models.reduce((acc, curr) => {
            const deps = curr[1].reduce(find_deps_model, {});
            if (deps !== null) {
              generators.push({
                gen: curr[0].gen,
                args: deps,
                context: { ...curr[0].context, ...deps },
              });
            } else acc.push(curr);

            return acc;
          }, []);
          break;
        }
        case DEPENDS_ON_MODEL: {
          const models = _nxt.value.payload;
          console.log(`RESOLVING DEPS`, models);

          const deps = models.reduce(find_deps_model, {});
          if (deps) {
            args = deps;
            context = { ...context, ...deps };
          } else {
            waiting_models.push([{ gen, args, context }, _nxt.value.payload]);
            continue;
          }

          break;
        }
        case CREATE_ROUTE: {
          const p = _nxt.value.payload;
          console.log(
            `CREATING ROUTE - ${p.method.toUpperCase()} ${p.path}`,
            Object.keys(context)
          );
          if (p.middlewares)
            configs.app[p.method](
              p.path,
              ...p.middlewares,
              p.handler.bind(context)
            );
          else configs.app[p.method](p.path, p.handler.bind(context));
          break;
        }
        case CREATE_MIDDLEWARE: {
          const { name, fn } = _nxt.value.payload;

          configs.middlewares.set(name, fn.bind(context));

          waiting_mids = waiting_mids.reduce((acc, curr) => {
            const deps = curr[1].reduce(find_deps_mids, {});
            if (deps !== null) {
              generators.push({
                gen: curr[0].gen,
                args: deps,
                context: curr[0].context,
              });
            } else acc.push(curr);

            return acc;
          }, []);
          break;
        }
        case DEPENDS_ON_MIDDLEWARE: {
          const mids = _nxt.value.payload;

          const deps = mids.reduce(find_deps_mids, {});
          if (deps) {
            args = deps;
            context = { ...deps, ...context };
          } else {
            waiting_mids.push([{ gen, args, context }, _nxt.value.payload]);
            continue;
          }

          break;
        }
      }
      generators.push({ gen, args, context });
    }
  }

  configs.app.listen(3000, () => {
    console.log('Listening port 3000');
  });
}

module.exports = boot;
