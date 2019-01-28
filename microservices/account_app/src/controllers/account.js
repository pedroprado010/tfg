const Account = require('../models/account');

function registerAccountPage(req, res) {
  res.render('account/register');
}

function registerAccount(req, res) {
  console.log(req.body);
  const account = new Account({
    email: req.body.email,
    password: req.body.pwd,
  });
  account.save(err => {
    if (err) {
      // console.log('DEU RUIM ', err);
      res.status(500).json({ error: err });
      return;
    }
    res.json({email: req.body.email});
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
  registerAccountPage,
  registerAccount,
  listAccounts,
  authenticate,
};
