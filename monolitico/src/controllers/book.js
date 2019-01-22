const Book = require('../models/book');
const Exemplar = require('../models/exemplar');

function listBooks(req, res) {
  const page = req.query.p || 0;
  Book.find({}, {}, { lean: true, limit: 10, skip: page * 10 }, (err, docs) => {
    if (err) {
      res.json({ erro: err });
    } else {
      const _q = docs.map((doc, i) => {
        return Exemplar.find({ book_id: doc._id }, '_id')
          .exec()
          .then(exemplars => {
            docs[i].exemplars = exemplars;
          });
      });
      Promise.all(_q)
        .then(r => {
          res.json({ docs });
        })
        .catch(err => {
          console.log(err);
          res.json({ err: 'deu rui' });
        });
    }
  });
}

function listExemplars(req, res) {
  Book.findById(req.params.book_id, {}, { lean: true })
    .exec()
    .then(book => {
      Exemplar.find({ book_id: req.params.book_id }, '-book_id')
        .exec()
        .then(docs => {
          book.exemplars = docs;
          res.json(book);
        })
        .catch(err => {
          res.json({ ruim: 'sim' });
        });
    });
}

function loanExemplar(req, res) {
  res.json(req.params);
  console.log(req.params.book_id);
  console.log(req.params.exemplar_id);
}

module.exports = { listBooks, listExemplars, loanExemplar };
