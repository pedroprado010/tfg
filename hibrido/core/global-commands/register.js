const model_commands = require('./model-commands');
const routing_commands = require('./routing-commands');

// Apenas para mapear deps
if (process.env.NODE_ENV === 'dev') {
  model_commands.pre_create_model = function(model_name) {
    if (model_commands.pre_create_model_cache.has(this.module_name)) {
      model_commands.pre_create_model_cache.set(this.module_name, [
        ...model_commands.pre_create_model_cache.get(this.module_name),
        model_name,
      ]);
    } else {
      model_commands.pre_create_model_cache.set(this.module_name, [model_name]);
    }
  };
}

const cache = [];

global.register = function(name, fn) {
  cache.push({ name, fn });
  return Object.create(null, {
    pre_create_model_hook: {
      value: model_commands.pre_create_model,
      writable: false,
      configurable: false,
      enumerable: true,
    },
    module_name: {
      value: name,
      writable: false,
      configurable: false,
      enumerable: true,
    },
  });
};

global.register.model = model_commands.create_model;
global.register.depends_on_model = model_commands.depends_on_model;
global.register.route = routing_commands.create_route;
global.register.middleware = routing_commands.create_middleware;
global.register.depends_on_middleware = routing_commands.depends_on_middleware;

module.exports = { cache };
