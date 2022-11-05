const Post = require('../models/Posts');
const User = require('../models/User');

exports.post_new_post = async (req, res, next) => {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : false;
    const { post_text } = req.body;
    if (image) {
      const newPost = new Post({
        author: req.authData.user._id,
        post_text,
        images: image,
      });
      newPost.save(async (error) => {
        if (error) {
          return next(error);
        } else {
          await User.findByIdAndUpdate(req.authData.user._id, {
            $push: { posts: newPost._id },
          });
          res.redirect(`/post/user:${req.authData.user._id}`);
        }
      });
    } else {
      const newPost = new Post({
        author: req.authData.user._id,
        post_text,
      });
      newPost.save(async (error) => {
        if (error) {
          return next(error);
        } else {
          await User.findByIdAndUpdate(req.authData.user._id, {
            $push: { posts: newPost._id },
          });
          res.redirect(`/post/user:${req.authData.user._id}`);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.get_user_posts = async function (req, res, next) {
  res.send(
    await User.findById(req.params.id, { posts: 1 }).populate({
      path: 'posts',
      options: { sort: { createdAt: -1 } },
    }),
  );
};
