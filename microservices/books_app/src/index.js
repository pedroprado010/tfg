const express = require('express');
const app = express();

app.all('/books', (req, res) => {
  res.json({books: 'app'});
});

app.listen(3000);
