const User = require('../models/User');

exports.get_auth_user_data = function (req, res, next) {
  res.send(req.authData);
};

exports.put_auth_user_data = async function (req, res, next) {
  let image =
    'file' in req
      ? req.file.filename
      : 'image_url' in req.body
      ? req.body.image_url
      : false;
  if (image) {
    User.findByIdAndUpdate(req.authData.user._id, {
      username: req.body.username,
      profile_picture: image,
    }).then(async () => {
      res.send({
        status: 'User information updated successfully',
        user: await User.findById(req.authData.user._id),
      });
    });
  } else {
    User.findByIdAndUpdate(req.authData.user._id, {
      username: req.body.username,
    }).then(async () => {
      res.send({
        status: 'User information updated successfully',
        user: await User.findById(req.authData.user._id),
      });
    });
  }
};

exports.delete_auth_user_data = function (req, res, next) {
  console.log(1);
  User.findByIdAndDelete(req.authData.user._id).then(() => {
    res.redirect('/users');
  });
};
