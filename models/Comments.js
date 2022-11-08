const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
    },
    post_text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    deleted: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('comments', CommentSchema);
