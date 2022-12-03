const User = require('../models/User');
const Post = require('../models/Posts');
const path = require('path');
const ChatMessage = require('../models/ChatMessage');

exports.get_connection_status = async function (req, res, next) {
  const mongoConnected = await User.findById('6385ebaa598c0f0fcf384f2f');
  if (mongoConnected) {
    setTimeout(() => {
      res.send({ connected: true });
    }, 2000);
  }
};

exports.get_user_data = async function (req, res, next) {
  res.send(
    await User.findById(req.params.id, {
      googleId: 0,
      admin: 0,
    }),
  );
};

exports.get_chat = async function (req, res, next) {
  res.send(
    await ChatMessage.find()
      .sort({ createdAt: 1 })
      .populate('author', 'username profile_picture'),
  );
};

exports.get_image = async function (req, res, next) {
  const imgFile = await User.findById(req.params.id, {
    profile_picture: 1,
  });
  const newPath = path.join(
    __dirname,
    '..',
    'public',
    'images',
    imgFile.profile_picture,
  );
  res.sendFile(newPath);
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

exports.get_timeline = async function (req, res, next) {
  const user = await User.findById(req.authData.user._id, { friends_list: 1 });
  user.friends_list.push({ _id: req.authData.user._id });
  res.send(
    await Post.find({
      author: {
        $in: user.friends_list,
      },
    })
      .sort({ createdAt: -1 })
      .populate('author'),
  );
};

exports.get_notifications = async function (req, res, next) {
  const user = await User.findById(req.authData.user._id);
  res.send({
    unread_notifications: user.unread_notifications,
    read_notifications: user.read_notifications,
  });
  await User.findByIdAndUpdate(req.authData.user._id, {
    $push: { read_notifications: { $each: user.unread_notifications } },
    $set: { unread_notifications: [] },
  });
};

exports.put_clear_notifications = async function (req, res, next) {
  const updatedUser = await User.findByIdAndUpdate(req.authData.user._id, {
    $set: { unread_notifications: [], read_notifications: [] },
  });
  res.send({
    unread_notifications: [],
    read_notifications: [updatedUser.read_notifications],
  });
};
