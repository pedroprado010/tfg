const mongoose = require('mongoose');

function preCompileModels(models) {
  // models.get('Exemplar').eachPath(p => console.log(p));
  models.get('Exemplar').add({
    loaned: {
      type: Boolean,
      default: false,
    },
  });
}

function registerSchema() {
  const loanHistoricSchema = new mongoose.Schema({
    exemplar_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Exemplar',
    },
    lodger: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    start: {
      type: Date,
      required: true,
    },
    end: Date,
    penalty: Number,
  });
  return ['LoanHistoric', loanHistoricSchema];
}

function postCompileModels(models) {
  // console.log('------');
  // models.get('Exemplar').schema.eachPath(p => console.log(p));
}

module.exports = { preCompileModels, registerSchema, postCompileModels };
