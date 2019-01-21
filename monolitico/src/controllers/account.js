const Account = require('../models/account');

function registerAccountPage(req, res, next) {
  res.render('account/register');
}

function registerAccount(req, res, next) {
  const account = new Account({ email: req.body.email, password: req.body.pwd });
  account.save((err) => {
    if (err) {
      console.log('DEU RUIM ', err);
      res.json({ error: err });
      return;
    }
    res.render('account/register');
  })
}

function listAccounts(req, res, next) {
  Account.find({}, (err, docs) => {
    if (!err) {
      res.render('account/list', { accounts: docs });
    }
  });
}

module.exports = { registerAccountPage, registerAccount, listAccounts };
