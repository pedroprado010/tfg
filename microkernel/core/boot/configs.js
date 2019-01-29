const express = require('express');
const __models = new Map();
const app = express();

module.exports = {
  models: __models,
  app,
}
