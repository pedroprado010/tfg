const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const bookControler = require('./controllers/book');

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

app.get('/books', bookControler.listBooks);
app.get('/books/:book_id/exemplar', bookControler.listExemplars);

app.listen(3000);
