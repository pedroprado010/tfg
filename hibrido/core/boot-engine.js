const mongoose = require('mongoose');
const configs = require('./configs');
const is_command = require('./validators/is-command');
const { cache } = require('./global-commands/register');
const { CREATE_MODEL } = require('./global-commands/action-types');
const { pre_create_model_cache } = require('./global-commands/model-commands');

function boot() {
  const generators = cache.map(f => f());
  let gen = null;
  let _nxt = null;
  let _args = null;
  while (generators.length) {
    gen = generators.pop();
    _nxt = gen.next(_args);
    if (_nxt.done) continue;
    if (is_command(_nxt.value)) {
      switch (_nxt.value.action) {
        case CREATE_MODEL: {
          const { name, schema, statics } = _nxt.value.payload;
          if (pre_create_model_cache.has(name)) {
            pre_create_model_cache.get(name).forEach(hook => {
              hook(schema, statics);
            });
          }
          const mongoose_schema = new mongoose.Schema(schema);

          !!statics && (mongoose_schema.statics = statics);

          _args = mongoose.model(name, mongoose_schema);
          configs.models.set(name, _args);
          break;
        }
      }
      generators.push(gen);
    }
  }
}

module.exports = boot;
