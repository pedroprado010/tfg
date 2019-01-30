const express = require('express');
const configs = require('./configs');

function registerAccount(req, res) {
  const account = new configs.models.get('Account')({
    email: req.body.email,
    password: req.body.pwd,
  });
  account
    .save()
    .then(account => {
      res.json({ email: account.email });
    })
    .catch(e => {
      res.status(500).json({
        error: Object.getOwnPropertyNames(e.errors).reduce((acc, curr) => {
          return [...acc, e.errors[curr].message];
        }, []),
      });
    });
}

function listAccounts(req, res) {
  configs.models.get('Account').find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    }
  });
}

function authenticate(req, res) {
  if (!req.body || !req.body.email || !req.body.password)
    return res.status(400).json({ error: 'Email ou senha não enviados.' });

  configs.models
    .get('Account')
    .login(req.body.email, req.body.password)
    .then(token => {
      res.json({ token });
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error });
    });
}

function listBooks(req, res) {
  const page = req.query.p || 0;
  configs.models
    .get('Book')
    .find({}, {}, { lean: true, limit: 10, skip: page * 10 }, (err, docs) => {
      if (err) {
        res.json({ erro: err });
      } else {
        const _q = docs.map((doc, i) => {
          return configs.models
            .get('Exemplar')
            .find({ book_id: doc._id }, '_id loaned')
            .exec()
            .then(exemplars => {
              docs[i].exemplars = exemplars;
            });
        });
        Promise.all(_q)
          .then(r => {
            res.json(docs);
          })
          .catch(err => {
            console.log(err);
            res.json({ err: 'deu rui' });
          });
      }
    });
}

function listExemplars(req, res) {
  configs.models
    .get('Book')
    .findById(req.params.book_id, {}, { lean: true })
    .exec()
    .then(book => {
      if (!book)
        return res.status(404).json({ error: 'Livro não cadastrado.' });
      configs.models
        .get('Exemplar')
        .find({ book_id: req.params.book_id }, '-book_id')
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

function registerRoutes(plugins) {
  configs.app.post('/account/register', registerAccount);
  configs.app.get('/account', listAccounts);
  configs.app.post('/account/login', authenticate);
  configs.app.get('/books', listBooks);
  configs.app.get('/books/:book_id/exemplar', listExemplars);

  plugins
    .filter(p => p.hasOwnProperty('registerRoutes'))
    .forEach(p => {
      [path, router] = p.registerRoutes(
        express.Router(),
        configs.models,
        configs.middlewares
      );
      configs.app.use(path, router);
    });
  return configs.app;
}

module.exports = registerRoutes;
