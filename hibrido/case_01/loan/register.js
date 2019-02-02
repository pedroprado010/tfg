const LoanHistoricModel = require('./models/loan-historic');
const routes = require('./routes');

register(function*() {
  yield create_model(LoanHistoricModel.name, LoanHistoricModel.schema);
  const models_dependencies = yield depends_on_model('Book', 'Exemplar', 'LoanHistoric');
  const { jwtMiddleware } = yield depends_on_middleware('jwtMiddleware');
  yield create_route('get', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.loanExemplar, models_dependencies);
  yield create_route('put', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.returnExemplar, models_dependencies);
  yield create_route('get', '/loan', jwtMiddleware ,routes.listLoans, models_dependencies);
});

pre_create_model('Exemplar', (schema, statics) => {
  schema.loaned = {
    type: Boolean,
    default: false,
  };
});
