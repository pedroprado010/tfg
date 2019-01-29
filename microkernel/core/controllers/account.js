const Account = require('../models/account');

function registerAccount(req, res) {
  const account = new Account({
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
  Account.find({}, (err, docs) => {
    if (!err) {
      res.render('account/list', { accounts: docs });
    }
  });
}

function authenticate(req, res) {
  if (!req.body || !req.body.email || !req.body.password)
    return res.status(400).json({ error: 'Email ou senha não enviados.' });

  Account.login(req.body.email, req.body.password)
    .then(token => {
      res.json({ token });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
}

module.exports = {
  registerAccount,
  listAccounts,
  authenticate,
};
