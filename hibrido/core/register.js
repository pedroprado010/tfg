const mongoose = require('mongoose');
const configs = require('./configs');

const register_cache = [];

const CREATE_MODEL = 1;

function boot() {
  const generators = register_cache.map(f => f());
  let gen = null;
  let _nxt = null;
  let _args = null;
  while (generators.length) {
    gen = generators.pop();
    _nxt = gen.next(_args);
    if (_nxt.done) continue;
    if (typeof _nxt.value === 'object' && !!_nxt.value.action) {
      switch (_nxt.value.action) {
        case CREATE_MODEL: {
          const { name, schema, statics } = _nxt.value.payload;
          console.log(`Creating model ${name}`);
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

global.register = function(fn) {
  register_cache.push(fn);
};

global.create_model = function(name, schema, statics) {
  return {
    action: CREATE_MODEL,
    payload: { name, schema, statics },
  };
};
