const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profile_picture: { type: String, default: 'no-image.png' },
  friends_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('users', UserSchema);
