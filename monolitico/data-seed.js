const mongoose = require('mongoose');
const csvParse = require('csv-parse');
const fs = require('fs');
const Book = require('./src/models/book');
const Exemplar = require('./src/models/exemplar');

mongoose.connect('mongodb://localhost:27017/tfg-db', { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('Erro ao conectar ao db');
  } else {
    const parser = csvParse({ delimiter: ';', from: 2, escape: '\\' });
    parser.on('error', (err) => {
      console.log(err.message)
    });
    parser.on('end', () => {
      console.log('fim');
      process.exit();
    });
    parser.on('readable', () => {
      let record;
      while (record = parser.read()) {
        if (parseInt(record[3]) !== NaN) {
          Book.create({
            isbn: record[0],
            title: record[1],
            author: record[2],
            year_of_publication: parseInt(record[3]),
            publisher: record[4],
            small_img_path: record[5],
            medium_img_path: record[6],
            large_img_path: record[7],
          }, (err, book) => {
            if (err) {
              if (err.code !== 11000) {
                console.log('falha ao salvar no banco', err);
                process.exit();
              }
            } else {
              console.log("salvo " + book.title);
              Exemplar.create({
                book_id: book._id,
              });
            }
          });
        }
      }
    });

    fs.createReadStream('../dump/BX-Books.csv').pipe(parser);
  }
});

