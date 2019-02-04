const BookModel = require('./models/Book');
const ExemplarModel = require('./models/Exemplar');
const routes = require('./routes');

register('books-module',function*() {
  yield register.model(BookModel.name, BookModel.schema);
  yield register.model(ExemplarModel.name, ExemplarModel.schema);
  yield register.route('get', '/books', routes.listBooks);
  yield register.route('get', '/books/:book_id/exemplar', routes.listExemplars);
});
