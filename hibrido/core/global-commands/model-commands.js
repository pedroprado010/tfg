const { CREATE_MODEL } = require('./action-types');

global.create_model = function(name, schema, statics) {
  return {
    action: CREATE_MODEL,
    payload: { name, schema, statics },
  };
};
