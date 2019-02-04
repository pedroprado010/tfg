const AccountModel = require('./models/account');
const jwtMiddleware = require('./middlewares/jwt-middleware');

register(function*() {
  yield create_model(AccountModel.name, AccountModel.schema, AccountModel.statics);
  yield create_middleware(jwtMiddleware.name, jwtMiddleware.callable);
});
