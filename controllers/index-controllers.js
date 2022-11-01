const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

exports.upload = multer({ storage: storage });

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
