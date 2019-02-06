const AccountModel = require('./models/account');
const jwtMiddleware = require('./middlewares/jwt-middleware');

register('accounts-internals',function*() {
  yield register.model(AccountModel.name, AccountModel.schema, AccountModel.statics);
  yield register.middleware(jwtMiddleware.name, jwtMiddleware.callable);

});
