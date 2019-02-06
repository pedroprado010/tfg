const run = require('../../core');
const path = require('path');

run({
  mongo_url: 'mongodb://mongo:27017/tfg-db',
  services_dir: path.resolve(__dirname, './'),
});
