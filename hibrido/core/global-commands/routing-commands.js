const {
  CREATE_ROUTE,
  CREATE_MIDDLEWARE,
  DEPENDS_ON_MIDDLEWARE,
} = require('./action-types');

function create_route(method, path, ...args) {
  let command = { method: method.toLowerCase(), path, handler: args.pop() };

  if (args.length) {
    command.middlewares = args;
  }
  return { action: CREATE_ROUTE, payload: command };
}

function create_middleware(name, fn) {
  return { action: CREATE_MIDDLEWARE, payload: { name, fn } };
}

function depends_on_middleware(...names) {
  return {
    action: DEPENDS_ON_MIDDLEWARE,
    payload: names,
  };
}

module.exports = { create_route, create_middleware, depends_on_middleware };
