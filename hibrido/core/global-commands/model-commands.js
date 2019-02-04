const { CREATE_MODEL, DEPENDS_ON_MODEL } = require('./action-types');

const pre_create_model_cache = new Map();

function create_model(name, schema, statics) {
  return {
    action: CREATE_MODEL,
    payload: { name, schema, statics },
  };
}

function pre_create_model(name, hook) {
  let hooks = null;
  if (pre_create_model_cache.has(name)) {
    hooks = [...pre_create_model_cache.get(name), hook];
  } else {
    hooks = [hook];
  }
  pre_create_model_cache.set(name, hooks);
}

function depends_on_model(...names) {
  return {
    action: DEPENDS_ON_MODEL,
    payload: names,
  };
}

module.exports = {
  depends_on_model,
  pre_create_model,
  create_model,
  pre_create_model_cache,
};
