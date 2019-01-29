// const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const loadPlugins = require('./boot/loadPlugins');
const registerSchemas = require('./boot/registerSchemas');
const compileModels = require('./boot/compileModels')
const compileRouters = require('./boot/compileRouters')
// const accountControler = require('./controllers/account');
// const bookControler = require('./controllers/book');
// const loanController = require('./controllers/loan');
// const authMiddleware = require('./lib/jwt-middleware');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb://mongo:27017/tfg-db',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db');
    }
  }
);

// function buildCoreRoutes() {
//   app.post('/account/register', accountControler.registerAccount);
//   app.get('/account', accountControler.listAccounts);
//   app.post('/account/login', accountControler.authenticate);

//   app.get('/books', bookControler.listBooks);
//   app.get('/books/:book_id/exemplar', bookControler.listExemplars);

//   app.get(
//     '/loan/:book_id/:exemplar_id',
//     [authMiddleware],
//     loanController.loanExemplar
//   );
//   app.put(
//     '/loan/:book_id/:exemplar_id',
//     [authMiddleware],
//     loanController.returnExemplar
//   );
//   app.get('/loan', [authMiddleware], loanController.listLoans);

//   app.listen(3000);
// }


loadPlugins()
  .then(registerSchemas)
  .then(compileModels)
  .then(compileRouters);

// buildCoreRoutes();
