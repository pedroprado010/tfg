const mongoose = require('mongoose');

const schema = {
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
};

const name = 'Exemplar';

module.exports = {
  schema,
  name,
};
