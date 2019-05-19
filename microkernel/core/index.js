const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const loadPlugins = require('./boot/loadPlugins');
const registerSchemas = require('./boot/registerSchemas');
const compileModels = require('./boot/compileModels');
const registerRoutes = require('./boot/registerRoutes');

mongoose.connect(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/tfg-db`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db');
    } else {
      loadPlugins()
        .then(registerSchemas)
        .then(compileModels)
        .then(registerRoutes)
        .then(app => {
          app.listen(3000);
        });
    }
  }
);



