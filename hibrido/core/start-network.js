const mongoose = require('mongoose');
const configs = require('./configs');

module.exports = function start_network(mongo_url = null) {
  if (!mongo_url) {
    return configs.app.listen(3000, () => {
      console.log('Listening port 3000');
    });
  }
  return mongoose
    .connect(mongo_url, { useNewUrlParser: true })
    .then(() => {
      configs.app.listen(3000, () => {
        console.log('Listening port 3000');
      });
    })
    .catch(err => {
      console.log(err);
    });
};
