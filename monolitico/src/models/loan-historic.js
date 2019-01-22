const mongoose = require('mongoose');

const loanHistoricSchema = new mongoose.Schema({
  exemplar_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Exemplar'
  },
  lodger: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  start: {
    type: Date,
    required: true,
  },
  end: Date,
  penalty: Number
});

const LoanHistoric = mongoose.model('LoanHistoric', loanHistoricSchema);

module.exports = LoanHistoric;
