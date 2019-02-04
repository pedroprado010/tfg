const model_commands = require('./model-commands');
const routing_commands = require('./routing-commands');

const cache = [];

const protoRegister = {
  hook: {
    pre_create_model: model_commands.pre_create_model
  }
};

global.register = function(name, fn) {
  cache.push({ name, fn });
  return Object.create(protoRegister, {
    module_name: {
      value: name,
      writable: false,
      configurable: false,
      enumerable: true
    }
  });
};

global.register.model = model_commands.create_model;
global.register.depends_on_model = model_commands.depends_on_model;
global.register.route = routing_commands.create_route;
global.register.middleware = routing_commands.create_middleware;
global.register.depends_on_middleware = routing_commands.depends_on_middleware;

module.exports = { cache };
