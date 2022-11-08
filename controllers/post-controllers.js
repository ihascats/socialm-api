const Post = require('../models/Posts');
const User = require('../models/User');

exports.post_new_post = async (req, res, next) => {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : undefined;
    const { post_text, parent } = req.body;
    const newPost = new Post({
      author: req.authData.user._id,
      post_text,
      image,
      parent,
    });
    newPost.save(async (error) => {
      if (error) {
        return next(error);
      } else {
        await User.findByIdAndUpdate(req.authData.user._id, {
          $push: { posts: newPost._id },
        });
        if (parent) {
          await Post.findByIdAndUpdate(parent, {
            $push: { replies: newPost._id },
          });
        }
        res.redirect(`/post/user:${req.authData.user._id}`);
      }
    });
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

exports.get_post = async function (req, res, next) {
  res.send(await Post.findById(req.params.id));
};

exports.delete_post = async function (req, res, next) {
  await Post.findByIdAndUpdate(req.params.id, {
    deleted: true,
  });
  res.redirect(`/post/user:${req.authData.user._id}`);
};

exports.put_post = async function (req, res, next) {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : undefined;
    const { post_text } = req.body;
    await Post.findByIdAndUpdate(req.params.id, {
      post_text,
      image,
    }).then(async () => {
      res.send({
        status: 'Post information updated successfully',
        post: await Post.findById(req.params.id),
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.post_permission_check = async function (req, res, next) {
  const post = await Post.findById(req.params.id).populate('author');
  post
    ? post.author._id.toString() === req.authData.user._id
      ? next()
      : res.status(401).send('Unauthorized')
    : res.status(404).send('Not Found');
};

exports.put_like = async function (req, res, next) {
  const post = await Post.findById(req.params.id);
  if (post.deleted) {
    res.status(404).send('Not Found');
    return;
  }
  if (post.likes.includes(req.authData.user._id)) {
    Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.authData.user._id },
    }).then(async () => {
      await User.findByIdAndUpdate(req.authData.user._id, {
        $pull: { likes: req.params.id },
      });
    });
  } else {
    Post.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.authData.user._id },
    }).then(async () => {
      await User.findByIdAndUpdate(req.authData.user._id, {
        $push: { likes: req.params.id },
      });
    });
  }
  res.send({ likeCount: (await Post.findById(req.params.id)).likes.length });
};
