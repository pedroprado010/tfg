const mongoose = require('mongoose');

const exemplarSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  loaned: {
    type: Boolean,
    default: false
  },
});

const Exemplar = mongoose.model('Exemplar', exemplarSchema);

module.exports = Exemplar;
