const LoanHistoricModel = require('./models/loan-historic');
const routes = require('./routes');

const loan_module = register('loan-module',function*() {
  yield register.model(LoanHistoricModel.name, LoanHistoricModel.schema);
  yield register.depends_on_model('Book', 'Exemplar');
  const { jwtMiddleware } = yield register.depends_on_middleware('jwtMiddleware');
  yield register.route('get', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.loanExemplar);
  yield register.route('put', '/loan/:book_id/:exemplar_id', jwtMiddleware ,routes.returnExemplar);
  yield register.route('get', '/loan', jwtMiddleware ,routes.listLoans);
});

loan_module.pre_create_model_hook('Exemplar', (schema, statics) => {
  schema.loaned = {
    type: Boolean,
    default: false,
  };
});
