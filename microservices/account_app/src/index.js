const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const accountControler = require('./controllers/account');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(
  'mongodb://mongo:27017/tfg-db',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db');
    }
  }
);

app.post('/account/register', accountControler.registerAccount);
app.get('/account', accountControler.listAccounts);
app.post('/account/login', accountControler.authenticate);
app.get('/account/is-auth', accountControler.isAuthenticated);
app.listen(3000);
