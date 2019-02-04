const jwt = require('jsonwebtoken');
const JWT_KEY = 'SUPER_SECRET';

const name = 'jwtMiddleware';

function callable(req, res, next) {
  if (!req.headers.authorization)
    return res.status(403).json({ error: 'Credenciais não enviadas.' });

  jwt.verify(req.headers.authorization, JWT_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: 'Credenciais inválidas.' });

    req.token = decoded;
    next();
  });
}

module.exports = { name, callable };
