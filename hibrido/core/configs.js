const express = require('express');
const bodyParser = require('body-parser');

const models = new Map();
const middlewares = new Map();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


module.exports = {
  models,
  app,
  middlewares,
};
