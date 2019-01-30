const LoanHistoricModel = require('./models/loan-historic');

register(function*() {
  yield create_model(LoanHistoricModel.name, LoanHistoricModel.schema);
});

