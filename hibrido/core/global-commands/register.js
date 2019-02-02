require('./model-commands');
require('./routing-commands');

const cache = [];

global.register = function(fn) {
  cache.push(fn);
};

module.exports = { cache };
