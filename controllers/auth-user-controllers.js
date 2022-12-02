const User = require('../models/User');
const { check, validationResult } = require('express-validator');

exports.username_validate = [
  check('username')
    .isLength({ min: 2 })
    .withMessage('Username must be at least 2 characters')
    .isLength({ max: 20 })
    .withMessage('Username must be at most 20 characters')
    .trim()
    .escape(),
];

exports.get_auth_user_data = async function (req, res, next) {
  res.send(await User.findById(req.authData.user._id, { googleId: 0 }));
};

exports.put_auth_user_data = async function (req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return;
  }
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
  User.findByIdAndDelete(req.authData.user._id).then(() => {
    res.redirect('/users');
  });
};

exports.put_friend_request = async function (req, res, next) {
  const authUser = await User.findById(req.authData.user._id);
  if (authUser.friend_requests.includes(req.params.id)) {
    res.redirect(`/user/accept_fr/${req.params.id}`);
  } else {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $push: { friend_requests: req.authData.user._id },
    });
    if (req.authData.user._id !== `${user._id}`) {
      await User.findByIdAndUpdate(user._id, {
        $push: {
          unread_notifications: {
            user: authUser._id,
            friend_request: true,
          },
        },
      });
    }
    res.status(200).send({
      status: 'Friend Request Sent',
      user: await User.findById(req.authData.user._id),
    });
  }
};

exports.put_accept_friend_request = async function (req, res, next) {
  const signedUser = await User.findById(req.authData.user._id);
  if (signedUser.friend_requests.includes(req.params.id)) {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { friends_list: req.authData.user._id },
    });
    await User.findByIdAndUpdate(req.authData.user._id, {
      $push: { friends_list: req.params.id },
      $pull: { friend_requests: req.params.id },
    });
    res.send({ user: await User.findById(req.authData.user._id) });
  } else {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { friend_requests: req.authData.user._id },
    });
    res.status(200).send({
      status: 'Friend Request Sent',
      user: await User.findById(req.authData.user._id),
    });
  }
};

exports.put_remove_friend = async function (req, res, next) {
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { friends_list: req.authData.user._id },
  });
  await User.findByIdAndUpdate(req.authData.user._id, {
    $pull: { friends_list: req.params.id },
  });
  res.send({ user: await User.findById(req.authData.user._id) });
};

exports.get_friend_requests = async function (req, res, next) {
  res.send(
    await User.findById(req.authData.user._id, { friend_requests: 1 })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: 'friend_requests',
        select: ['username', 'profile_picture'],
      }),
  );
};

exports.get_outgoing_friend_requests = async function (req, res, next) {
  res.send(
    await User.find({
      friend_requests: req.authData.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: 'friend_requests',
        select: ['username', 'profile_picture'],
      }),
  );
};

exports.put_decline_friend_request = async function (req, res, next) {
  await User.findByIdAndUpdate(req.authData.user._id, {
    $pull: { friend_requests: req.params.id },
  });
  res.send({ user: await User.findById(req.authData.user._id) });
};

exports.request_check = async function (req, res, next) {
  const nonFriend = await User.findById(req.params.id);
  if (
    nonFriend.friends_list.includes(req.authData.user._id) ||
    nonFriend.friend_requests.includes(req.authData.user._id) ||
    req.params.id === req.authData.user._id
  ) {
    res.send("Can't Send Request");
  } else {
    next();
  }
};
