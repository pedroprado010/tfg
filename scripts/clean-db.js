const mongoose = require('../monolitico/node_modules/mongoose');

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
const Account = mongoose.model('Account', accountSchema);

const exemplarSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Book'
  },
  loaned: {
    type: Boolean,
    default: false
  },
});
const Exemplar = mongoose.model('Exemplar', exemplarSchema);

function run() {
  Exemplar.updateMany({ loaned: true }, { loaned: false }, (err) => {
    if (err) console.log('erro ao limpar exemplars');
    Account.deleteMany({}, (err) => {
      if (err) console.log('erro ao limpar accounts');
      mongoose.connection.close();
      process.exit();
    });
  });
}



mongoose.connect(
  'mongodb://localhost:27017/tfg-db',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Erro ao conectar ao db', err);
    } else {
      console.log('conectado ao db');
      run();
    }
  }
);
