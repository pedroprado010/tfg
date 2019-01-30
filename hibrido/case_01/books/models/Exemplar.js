const mongoose = require('mongoose');

const schema = {
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  loaned: {
    type: Boolean,
    default: false,
  },
};

const name = 'Exemplar';

module.exports = {
  schema,
  name,
};
