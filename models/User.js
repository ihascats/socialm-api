const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  googleId: { type: String },
  profile_picture: { type: String, default: 'no-image.png' },
  friends_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  friend_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  unread_notifications: [{}],
  read_notifications: [{}],
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('users', UserSchema);
