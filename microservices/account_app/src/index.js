const express = require('express');
const app = express();

app.all('/account', (req, res) => {
  res.json({account: 'app'});
});

app.listen(3000);
