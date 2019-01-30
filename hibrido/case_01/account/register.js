const jwt = require('jsonwebtoken');

register(function*() {
  const account_schema = {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  };
  const account_statics = {
    login: function(email, password) {
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
    }
  }
  yield create_model('Account', account_schema, account_statics);
});
