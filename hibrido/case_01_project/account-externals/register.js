const controllers = require('./controllers');

register('account-externals',function*() {
  yield register.depends_on_model('Account');
  yield register.depends_on_middleware('jwtMiddleware');
  yield register.route('get', '/account', controllers.listAccounts);
  yield register.route('post', '/account/login', controllers.authenticate);
  yield register.route('post', '/account/register', controllers.registerAccount);
});
