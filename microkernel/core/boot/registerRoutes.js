const express = require('express');
const configs = require('./configs');

function registerRoutes(plugins) {
  plugins
  .filter(p => p.hasOwnProperty('registerRoutes'))
  .forEach(p => {
    [path, router] = p.registerRoutes(express.Router(), configs.models);
    configs.app.use(path, router);
  });
  return plugins;
}

module.exports = registerRoutes;
