const controllers = require('./controllers');

register('books-externals',function*() {
  yield register.depends_on_model('Book', 'Exemplar');
  yield register.route('get', '/books', controllers.listBooks);
  yield register.route('get', '/books/:book_id/exemplar', controllers.listExemplars);
});
