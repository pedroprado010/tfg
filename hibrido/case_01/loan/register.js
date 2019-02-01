const LoanHistoricModel = require('./models/loan-historic');

register(function*() {
  yield create_model(LoanHistoricModel.name, LoanHistoricModel.schema);
});

pre_create_model('Exemplar', (schema, statics) => {
  schema.loaned = {
    type: Boolean,
    default: false,
  };
});
