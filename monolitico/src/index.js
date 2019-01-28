const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const homeController = require('./controllers/home');
const accountControler = require('./controllers/account');
const bookControler = require('./controllers/book');
const loanController = require('./controllers/loan');

const authMiddleware = require('./lib/jwt-middleware');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb://mongo:27017/tfg-db',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db');
    }
  }
);

app.get('/', homeController.index);

app.get('/account/register', accountControler.registerAccountPage);
app.post('/account/register', accountControler.registerAccount);
app.get('/account', accountControler.listAccounts);
app.post('/account/login', accountControler.authenticate);

app.get('/books', bookControler.listBooks);
app.get('/books/:book_id/exemplar', bookControler.listExemplars);

app.get(
  '/loan/:book_id/:exemplar_id',
  [authMiddleware],
  loanController.loanExemplar
);
app.put(
  '/loan/:book_id/:exemplar_id',
  [authMiddleware],
  loanController.returnExemplar
);
app.get('/loan', [authMiddleware], loanController.listLoans);

app.listen(3000);
