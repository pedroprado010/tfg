const routes = require('./routes');

register('books-externals',function*() {
  yield register.depends_on_model('Book', 'Exemplar');
  yield register.route('get', '/books', routes.listBooks);
  yield register.route('get', '/books/:book_id/exemplar', routes.listExemplars);
});
