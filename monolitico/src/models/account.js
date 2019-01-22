const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../lib/constants').JWT_KEY;

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

accountSchema.statics.login = function(email, password) {
  return new Promise((resolve, reject) => {
    if (!password || !email) return reject('Senha ou email não enviados');

    this.findOne({ email, password })
      .exec()
      .then(usr => {
        console.log(usr);
        if (!usr)
          return reject('Senha ou Email inválido.')
        const token = jwt.sign({ id: usr._id }, JWT_KEY, { expiresIn: '1h' });
        resolve(token);
      })
      .catch(reject);
  });
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
