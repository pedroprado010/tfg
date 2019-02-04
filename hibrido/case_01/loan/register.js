const LoanHistoricModel = require('./models/loan-historic');
const routes = require('./routes');

register(function*() {
  yield create_model(LoanHistoricModel.name, LoanHistoricModel.schema);
  yield depends_on_model('Book', 'Exemplar', 'LoanHistoric');
  const { jwtMiddleware } = yield depends_on_middleware('jwtMiddleware');
  yield create_route('get', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.loanExemplar);
  yield create_route('put', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.returnExemplar);
  yield create_route('get', '/loan', jwtMiddleware ,routes.listLoans);
});

pre_create_model('Exemplar', (schema, statics) => {
  schema.loaned = {
    type: Boolean,
    default: false,
  };
});
