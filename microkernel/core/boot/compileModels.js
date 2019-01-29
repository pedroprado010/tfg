const configs = require('./configs');
const mongoose = require('mongoose');

function preCompileModelsHooks(plugins) {
  plugins
    .filter(p => p.hasOwnProperty('preCompileModels'))
    .forEach(m => {
      m.preCompileModels(configs.models);
    });
}

function postCompileModelsHooks(plugins) {
  plugins
    .filter(p => p.hasOwnProperty('postCompileModels'))
    .forEach(m => {
      m.postCompileModels(configs.models);
    });
}

function compileModels(plugins) {
  preCompileModelsHooks(plugins);
  configs.models.forEach((schema, name, m) => {
    m.set(name, mongoose.model(name, schema));
  });
  postCompileModelsHooks(plugins);
  return plugins;
}

module.exports = compileModels;
