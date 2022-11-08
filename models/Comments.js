const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
    },
    comment_text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('comments', CommentSchema);
