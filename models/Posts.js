const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    post_text: { type: String, required: true },
    // images: { type: String, required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model('posts', PostSchema);
