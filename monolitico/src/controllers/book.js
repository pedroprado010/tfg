const Book = require('../models/book');
const Exemplar = require('../models/exemplar');

function listBooks(req, res) {
  const page = req.query.p || 0;
  Book.find({}, {}, { lean: true, limit: 10, skip: page * 10 }, (err, docs) => {
    if (err) {
      res.json({ erro: err });
    } else {
      const _q = docs.map((doc, i) => {
        return Exemplar.find({ book_id: doc._id }, '_id loaned')
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
      if (!book)
        return res.status(404).json({ error: 'Livro não cadastrado.' });
      Exemplar.find({ book_id: req.params.book_id }, '-book_id')
        .exec()
        .then(docs => {
          book.exemplars = docs;
          res.json(book);
        })
        .catch(error => {
          res.json({ error });
        });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
}


module.exports = { listBooks, listExemplars };
