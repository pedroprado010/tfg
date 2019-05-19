const mongoose = require('mongoose');
const moment = require('moment');
const LOAN_DAY_LIMIT = 5;
const LOAN_PENALTY_PER_DAY = 0.50;

function loanExemplar(req, res) {
  Promise.all([
    this.Book.findById(req.params.book_id),
    this.Exemplar.findById(req.params.exemplar_id),
  ])
    .then(results => {
      const book = results[0];
      const exemplar = results[1];

      if (!book || !exemplar) throw new Error('livro ou exemplar inválido.');
      if (exemplar.loaned) throw new Error('Esse exemplar já foi emprestado.');

      const newLoan = new this.LoanHistoric({
        exemplar_id: req.params.exemplar_id,
        lodger: req.token.id,
        start: Date.now(),
      });
      return Promise.all([newLoan.save(), exemplar.update({ loaned: true })]);
    })
    .then(results => {
      res.json({ loan: results[0], exemplar: results[1] });
    })
    .catch(error => {
      console.log(error);
      res.status(500);
      if (error) return res.json({ error: error.message || error });

      return res.json({ error: 'Não foi possível emprestar o livro.' });
    });
}

function returnExemplar(req, res) {
  Promise.all([
    this.LoanHistoric.findOne({
      lodger: req.token.id,
      exemplar_id: req.params.exemplar_id,
      end: { $exists: false },
    }),
    this.Exemplar.findById(req.params.exemplar_id),
  ])
    .then(result => {
      const loan = result[0];
      const exemplar = result[1];

      if (!loan || !exemplar)
        throw new Error('Exemplar não existe ou não está emprestado');
      if (!exemplar.loaned)
        throw new Error('Esse exemplar não esta emprestado.');

      let __update_fields = { end: Date.now() };
      const s_day = moment(loan.start);
      const e_day = moment(__update_fields.end);
      const diff_days = e_day.diff(s_day, 'days');

      if (diff_days > LOAN_DAY_LIMIT) {
        __update_fields.penalty = LOAN_PENALTY_PER_DAY * diff_days;
      }

      return Promise.all([
        loan.update(__update_fields),
        exemplar.update({ loaned: false }),
      ]);
    })
    .then(result => {
      res.json({ loan: result[0], exemplar: result[1] });
    })
    .catch(error => {
      console.log(error);

      res.status(500);
      if (error) return res.json({ error: error.message || error });

      res.json({ error: 'Não foi possível devolver o livro' });
    });
}

function listLoans(req, res) {
  this.LoanHistoric.find(
    {
      lodger: req.token.id,
      end: { $exists: false },
    },
    '-lodger',
    { lean: true, limit: 10 }
  )
    .then(loans => {
      res.json(loans);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

function preCompileModels(models) {
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

function registerRoutes(router, models, middlewares) {
  const authMiddleware = middlewares.get('authMiddleware');
  const that = {
    Book: models.get('Book'),
    Exemplar: models.get('Exemplar'),
    LoanHistoric: models.get('LoanHistoric')
  };

  router.get('/', [authMiddleware], listLoans.bind(that));
  router.get(
    '/:book_id/:exemplar_id',
    [authMiddleware],
    loanExemplar.bind(that)
  );
  router.put(
    '/:book_id/:exemplar_id',
    [authMiddleware],
    returnExemplar.bind(that)
  );
  return ['/loan', router];
}

function postCompileModels(models) {

}

module.exports = {
  registerRoutes,
  preCompileModels,
  registerSchema,
  postCompileModels,
};
