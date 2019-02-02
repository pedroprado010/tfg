const { CREATE_ROUTE, CREATE_MIDDLEWARE, DEPENDS_ON_MIDDLEWARE } = require('./action-types');

global.create_route = function(method, path, ...args) {
  const last_arg = args.pop();
  let command = { method: method.toLowerCase(), path };
  if (typeof last_arg === 'function') {
    command.handler = last_arg;
  } else if (typeof last_arg === 'object') {
    command.bindthis = last_arg;
    command.handler = args.pop();
  }

  if (args.length) {
    command.middlewares = args;
  }
  return { action: CREATE_ROUTE, payload: command };
};

global.create_middleware = function(name, fn) {
  return { action: CREATE_MIDDLEWARE, payload: { name, fn } };
};

global.depends_on_middleware = function(...names) {
  return {
    action: DEPENDS_ON_MIDDLEWARE,
    payload: names,
  };
}
