const { CREATE_MODEL, DEPENDS_ON_MODEL } = require('./action-types');

const pre_create_model_cache = new Map();

global.create_model = function(name, schema, statics) {
  return {
    action: CREATE_MODEL,
    payload: { name, schema, statics },
  };
};

global.pre_create_model = function(name, hook) {
  let hooks = null;
  if (pre_create_model_cache.has(name)) {
    hooks = [...pre_create_model_cache.get(name), hook];
  } else {
    hooks = [hook];
  }
  pre_create_model_cache.set(name, hooks);
};

global.depends_on_model = function(...names) {
  return {
    action: DEPENDS_ON_MODEL,
    payload: names,
  };
};

module.exports = { pre_create_model_cache };
