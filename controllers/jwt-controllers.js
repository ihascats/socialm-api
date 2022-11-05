const jwt = require('jsonwebtoken');

exports.signToken = function (payload) {
  return jwt.sign(payload, process.env.JWTSECRET);
};

exports.verifyToken = function (req, res, next) {
  const token = req.headers.Authorization || req.headers.authorization || '';
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  jwt.verify(token, process.env.JWTSECRET, (err, authData) => {
    if (err) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    req.authData = authData;
    next();
  });
};
