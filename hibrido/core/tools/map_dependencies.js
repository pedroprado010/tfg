const is_command = require('../validators/is-command');
const { cache } = require('../global-commands/register');
const {
  CREATE_MODEL,
  DEPENDS_ON_MODEL,
  CREATE_ROUTE,
  CREATE_MIDDLEWARE,
  DEPENDS_ON_MIDDLEWARE,
} = require('../global-commands/action-types');
const { pre_create_model_cache } = require('../global-commands/model-commands');

function map_deps() {
  const generators = cache.map(m => ({
    gen: m.fn(),
    mod_name: m.name,
    resolves: [],
    depends: [],
    exposes: [],
    args: null,
  }));
  const mapped_deps = [];
  let _nxt = null;
  console.log('MODULES ', generators.length);
  while (generators.length) {
    let { gen, mod_name, resolves, depends, args, exposes } = generators.pop();
    _nxt = gen.next(args);
    // Não há mais ações, registro pronto
    if (_nxt.done) {
      mapped_deps.push({ mod_name, resolves, depends, exposes });
      continue;
    }

    if (is_command(_nxt.value)) {
      switch (_nxt.value.action) {
        case CREATE_MODEL: {
          const { name } = _nxt.value.payload;
          resolves.push(name);
          break;
        }
        case DEPENDS_ON_MODEL: {
          const models = _nxt.value.payload;
          depends.push(...models);
          args = models.reduce((acc, curr) => {
            acc[curr] = null;
            return acc;
          }, {});
          break;
        }
        case CREATE_ROUTE: {
          const p = _nxt.value.payload;
          exposes.push(`${p.method.toUpperCase()} - [${p.path}]`);
          break;
        }
        case CREATE_MIDDLEWARE: {
          const { name } = _nxt.value.payload;
          resolves.push(name);
          break;
        }
        case DEPENDS_ON_MIDDLEWARE: {
          const mids = _nxt.value.payload;
          depends.push(...mids);
          args = mids.reduce((acc, curr) => {
            acc[curr] = null;
            return acc;
          }, {});

          break;
        }
      }
      generators.push({ gen, depends, mod_name, resolves, exposes, args });
    }
  }
  mapped_deps.forEach(i => {
    console.log(i.mod_name);
    let table = {
      depends:
        i.depends /*.reduce((acc, str) => str ? `${acc}, ${str}`: '', '')*/,
      resolves: i.resolves, //.reduce((acc, str) => str? `${acc}, ${str}`: '', ''),
      exposes: i.exposes,
    };

    console.table(table);
  });
}

module.exports = map_deps;
