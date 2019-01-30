require('./model-commands');

const cache = [];

global.register = function(fn) {
  cache.push(fn);
};

module.exports = { cache };
