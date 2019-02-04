const BookModel = require('./models/Book');
const ExemplarModel = require('./models/Exemplar');

register('books-internals',function*() {
  yield register.model(BookModel.name, BookModel.schema);
  yield register.model(ExemplarModel.name, ExemplarModel.schema);
});
