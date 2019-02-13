const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const loanController = require('./controllers/loan');

const authMiddleware = require('./lib/jwt-middleware');

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
