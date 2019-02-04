const AccountModel = require('./models/account');
const jwtMiddleware = require('./middlewares/jwt-middleware');
const routes = require('./routes');

register(function*() {
  yield create_model(AccountModel.name, AccountModel.schema, AccountModel.statics);
  yield create_middleware(jwtMiddleware.name, jwtMiddleware.callable);
  yield create_route('post', '/account/register', routes.registerAccount);
  yield create_route('get', '/account', routes.listAccounts);
  yield create_route('post', '/account/login', routes.authenticate);
});
