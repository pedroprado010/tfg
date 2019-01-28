const express = require('express');
const app = express();

app.all('/loan', (req, res) => {
  res.json({loan: 'app'});
});

app.listen(3000);
