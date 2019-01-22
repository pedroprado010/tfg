const LoanHistoric = require('../models/loan-historic');
const Book = require('../models/book');
const Exemplar = require('../models/exemplar');

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
      res.status(500);
      if (error) return res.json({ error: error.message || error });

      return res.json({ error: 'Não foi possível emprestar o livro.' });
    });
}

function returnExemplar(req, res) {
  Exemplar.findById(req.params.exemplar_id)
    .exec()
    .then(exemplar => {
      if (!exemplar.loaned)
        throw new Error('Esse exemplar não esta emprestado.');

      return Promise.all([
        LoanHistoric.findOneAndUpdate(
          {
            lodger: req.token.id,
            exemplar_id: req.params.exemplar_id,
            end: { $exists: false },
          },
          { end: Date.now() }
        ),
        exemplar.update({ loaned: false }).exec(),
      ]);
    })
    .then(result => {
      console.log(result);
      res.json({ loan: result[0], exemplar: result[1] });
    })
    .catch(error => {
      res.status(500);
      if (error) return res.json({ error: error.message || error });

      res.json({ error: 'Não foi possível devolver o livro' });
    });
}

module.exports = { loanExemplar, returnExemplar };
