const axios = require('axios').default;

function jwtMiddleware(req, res, next) {
  axios
    .get('http://account_app:3000/account/is-auth', {
      headers: {
        authorization: req.headers.authorization,
      },
    })
    .then(res => {
      req.token = res.data.token;
      next();
    })
    .catch(error => {
      res.status(403);
      if (error && error.response && error.response.data && error.response.data.error)
        res.json({ error: "error.response.data.error" });
      else
        res.json({ error: 'Não foi possível completar a operação.'})
    });
}

module.exports = jwtMiddleware;
