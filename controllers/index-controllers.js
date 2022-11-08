const User = require('../models/User');

exports.get_user_data = async function (req, res, next) {
  res.send(
    await User.findById(req.params.id, {
      googleId: 0,
      admin: 0,
    })
      .populate({ path: 'posts', match: { deleted: false } })
      .populate({ path: 'likes', match: { deleted: false } })
      .populate({ path: 'comments', match: { deleted: false } }),
  );
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
  res.send(
    await User.find(
      {},
      {
        username: 1,
        profile_picture: 1,
      },
    ),
  );
};
