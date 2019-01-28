const jwt = require('jsonwebtoken');
const Account = require('../models/account');
const JWT_KEY = require('../lib/constants').JWT_KEY;

function registerAccount(req, res) {
  console.log(req.body);
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
  Account.find({}, {}, { lean: true })
    .then(accs => {
      res.json(accs);
    })
    .catch(e => {
      res.status(500);
      if (e)
        res.json({
          error: Object.getOwnPropertyNames(e.errors).reduce((acc, curr) => {
            return [...acc, e.errors[curr].message];
          }, []),
        });
      res.json({ error: 'Unknow error.' });
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

function isAuthenticated(req, res) {
  if (!req.headers.authorization)
    return res.status(403).json({ error: 'Credenciais não enviadas.' });

  jwt.verify(req.headers.authorization, JWT_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: 'Credenciais inválidas.' });
    res.status(200).json({ token: decoded });
  });
}

module.exports = {
  registerAccount,
  listAccounts,
  authenticate,
  isAuthenticated,
};
