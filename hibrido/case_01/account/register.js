const AccountModel = require('./models/account');
const jwtMiddleware = require('./middlewares/jwt-middleware');
const routes = require('./routes');

register('account-module',function*() {
  yield register.model(AccountModel.name, AccountModel.schema, AccountModel.statics);
  yield register.middleware(jwtMiddleware.name, jwtMiddleware.callable);
  yield register.route('post', '/account/register', routes.registerAccount);
  yield register.route('get', '/account', routes.listAccounts);
  yield register.route('post', '/account/login', routes.authenticate);
});
