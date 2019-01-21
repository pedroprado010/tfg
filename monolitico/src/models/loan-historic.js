const mongoose = require('mongoose');

const loanHistoricSchema = new mongoose.Schema({
  exemplar_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exemplar'
  },
  start: {
    type: Date,
    required: true,
  },
  end: Date,
});

const LoanHistoric = mongoose.model('LoanHistoric', loanHistoricSchema);

module.exports = LoanHistoric;
