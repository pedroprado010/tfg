const mongoose = require('mongoose');

const schema = {
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
};

const name = 'LoanHistoric';

module.exports = { schema, name };
