const BookModel = require('./models/Book');
const ExemplarModel = require('./models/Exemplar');
const routes = require('./routes');

register(function*() {
  yield create_model(BookModel.name, BookModel.schema);
  yield create_model(ExemplarModel.name, ExemplarModel.schema);
  yield create_route('get', '/books', routes.listBooks);
  yield create_route('get', '/books/:book_id/exemplar', routes.listExemplars);
});
