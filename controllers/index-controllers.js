const multer = require('multer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWTSECRET);
}

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

exports.upload = multer({ storage: storage });

exports.get_login_key = function (req, res, next) {
  if (req.user) {
    res.send(
      signToken(
        { user: req.user },
        {
          expiresIn: '16d',
        },
      ),
    );
  } else {
    res.send({ status: 'Invalid login' });
  }
};

exports.get_auth_user_data = function (req, res, next) {
  res.send(req.authData);
};

exports.post_signup = async function (req, res, next) {
  new User({
    username: req.body.username,
    profile_picture: req.file.filename,
    admin: req.body.admin,
  }).save((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/users');
  });
};

exports.get_users = async function (req, res, next) {
  res.send(await User.find());
};

exports.delete_user = function (req, res, next) {
  User.findByIdAndDelete(req.params.id).then(() => {
    res.redirect('/users');
  });
};
