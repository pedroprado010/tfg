const BookModel = require('./models/Book');
const ExemplarModel = require('./models/Exemplar');

register(function*() {
  yield create_model(BookModel.name, BookModel.schema);
  yield create_model(ExemplarModel.name, ExemplarModel.schema);
});

