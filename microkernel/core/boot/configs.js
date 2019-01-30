const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const JWT_KEY = require('./constants').JWT_KEY;

const models = new Map();
const middlewares = new Map();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

function authMiddleware(req, res, next) {
  if (!req.headers.authorization)
    return res.status(403).json({ error: 'Credenciais não enviadas.' });

  jwt.verify(req.headers.authorization, JWT_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: 'Credenciais inválidas.' });

    req.token = decoded;
    next();
  });
}

middlewares.set('authMiddleware', authMiddleware);

module.exports = {
  models,
  app,
  middlewares,
};
