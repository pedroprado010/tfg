const LoanHistoric = require('../models/loan-historic');
const Book = require('../models/book');
const Exemplar = require('../models/exemplar');

function loanExemplarPage(req, res) {
  res.render('loan-exemplar');
}

function loanExemplar(req, res) {
  Promise.all([
    Book.findById(req.params.book_id).exec(),
    Exemplar.findById(req.params.exemplar_id).exec(),
  ])
    .then(results => {
      const book = results[0];
      const exemplar = results[1];

      if (!book || !exemplar) throw new Error('livro ou exemplar inválido.');
      if (exemplar.loaned) throw new Error('Esse exemplar já foi emprestado.');

      const newLoan = new LoanHistoric({
        exemplar_id: req.params.exemplar_id,
        lodger: req.token.id,
        start: Date.now(),
      });
      return Promise.all([
        newLoan.save(),
        exemplar.update({ loaned: true }).exec(),
      ]);
    })
    .then(results => {
      res.json({ loan: results[0], exemplar: results[1] });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error.message || error });
    });
}

module.exports = { loanExemplar, loanExemplarPage };
