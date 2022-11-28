const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    message: { type: String, required: true },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('chatMessage', chatMessageSchema);
