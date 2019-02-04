const routes = require('./routes');

register('account-externals',function*() {
  yield register.depends_on_model('Account');
  yield register.depends_on_middleware('jwtMiddleware');
  yield register.route('get', '/account', routes.listAccounts);
  yield register.route('post', '/account/login', routes.authenticate);
  yield register.route('post', '/account/register', routes.registerAccount);
});
