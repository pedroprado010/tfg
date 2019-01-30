const mongoose = require('mongoose');
const configs = require('./configs');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('./constants').JWT_KEY;

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  year_of_publication: { type: Number },
  author: { type: String },
  publisher: { type: String },
  small_img_path: { type: String },
  medium_img_path: { type: String },
  large_img_path: { type: String },
});

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
        if (!usr) return reject('Senha ou Email inválido.');
        const token = jwt.sign({ id: usr._id }, JWT_KEY, { expiresIn: '1h' });
        resolve(token);
      })
      .catch(reject);
  });
};

const exemplarSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
});

function registerSchemas(plugins) {
  configs.models.set('Book', bookSchema);
  configs.models.set('Exemplar', exemplarSchema);
  configs.models.set('Account', accountSchema);

  plugins
    .filter(p => p.hasOwnProperty('registerSchema'))
    .forEach(p => {
      [name, schema] = p.registerSchema();
      configs.models.set(name, schema);
    });
  return plugins;
}

module.exports = registerSchemas;
