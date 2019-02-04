const mongoose = require('mongoose');
const configs = require('./configs');

module.exports = function start_network() {
  mongoose
    .connect('mongodb://mongo:27017/tfg-db', { useNewUrlParser: true })
    .then(() => {
      configs.app.listen(3000, () => {
        console.log('Listening port 3000');
      });
    })
    .catch(err => {
      console.log(err);
    });
};
