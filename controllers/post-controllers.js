const Post = require('../models/Posts');
const Comment = require('../models/Comments');
const User = require('../models/User');
const path = require('path');

exports.post_new_post = async (req, res, next) => {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : undefined;
    const { post_text } = req.body;
    const newPost = new Post({
      author: req.authData.user._id,
      post_text,
      image,
    });
    newPost.save(async (error) => {
      if (error) {
        return next(error);
      } else {
        res.redirect(`/post/user/${req.authData.user._id}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.get_post_image = async function (req, res, next) {
  const imgFile = await Post.findById(req.params.id, {
    image: 1,
  });
  if ('image' in imgFile) {
    const newPath = path.join(
      __dirname,
      '..',
      'public',
      'images',
      imgFile.image,
    );
    res.sendFile(newPath);
  } else {
    res.send(null);
  }
};

exports.get_user_posts_comments = async function (req, res, next) {
  res.send({
    posts: await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author'),
    comments: await Comment.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author'),
  });
};

exports.get_post = async function (req, res, next) {
  res.send(
    await Post.findById(req.params.id)
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username profile_picture',
        },
      })
      .populate('author', 'username profile_picture'),
  );
};

exports.get_comment = async function (req, res, next) {
  res.send(await Comment.findById(req.params.id));
};

exports.delete_post = async function (req, res, next) {
  await Post.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ parent: req.params.id });
  if (req.params.path === 'timeline') {
    const user = await User.findById(req.authData.user._id, {
      friends_list: 1,
    });
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
  } else if (req.params.path === 'user') {
    res.send({
      posts: await Post.find({ author: req.authData.user._id })
        .sort({ createdAt: -1 })
        .populate('author'),
      comments: await Comment.find({ author: req.authData.user._id })
        .sort({ createdAt: -1 })
        .populate('author'),
    });
  }
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
        post: await Post.findById(req.params.id)
          .populate({
            path: 'replies',
            populate: {
              path: 'author',
              select: 'username profile_picture',
            },
          })
          .populate('author', 'username profile_picture'),
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.put_comment = async function (req, res, next) {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : undefined;
    const { comment_text } = req.body;
    await Comment.findByIdAndUpdate(req.params.id, {
      comment_text,
      image,
    }).then(async () => {
      res.send({
        status: 'Comment information updated successfully',
        comment: await Comment.findById(req.params.id),
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

exports.comment_permission_check = async function (req, res, next) {
  const comment = await Comment.findById(req.params.id).populate('author');
  comment
    ? comment.author._id.toString() === req.authData.user._id
      ? next()
      : res.status(401).send('Unauthorized')
    : res.status(404).send('Not Found');
};

exports.delete_comment = async function (req, res, next) {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  const post = comment.parent;
  await Post.findByIdAndUpdate(post, {
    $pull: { replies: req.params.id },
  });
  if (req.params.path === 'post')
    res.send(
      await Post.findById(post)
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: 'username profile_picture',
          },
        })
        .populate('author', 'username profile_picture'),
    );
  if (req.params.path === 'user')
    res.send({
      posts: await Post.find({ author: req.authData.user._id })
        .sort({ createdAt: -1 })
        .populate('author'),
      comments: await Comment.find({ author: req.authData.user._id })
        .sort({ createdAt: -1 })
        .populate('author'),
    });
};

exports.put_like = async function (req, res, next) {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).send('Not Found');
    return;
  }
  if (post.likes.includes(req.authData.user._id)) {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.authData.user._id },
    });
  } else {
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.authData.user._id },
    });
  }
  res.send({ likeCount: (await Post.findById(req.params.id)).likes.length });
};

exports.put_comment_like = async function (req, res, next) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404).send('Not Found');
    return;
  }
  if (comment.likes.includes(req.authData.user._id)) {
    await Comment.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.authData.user._id },
    });
  } else {
    await Comment.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.authData.user._id },
    });
  }
  res.send({ likeCount: (await Comment.findById(req.params.id)).likes.length });
};

exports.post_comment = async function (req, res, next) {
  try {
    let image =
      'file' in req
        ? req.file.filename
        : 'image_url' in req.body
        ? req.body.image_url
        : undefined;
    const { comment_text } = req.body;
    const parent = req.params.id;
    const newComment = new Comment({
      author: req.authData.user._id,
      parent,
      comment_text,
      image,
    });
    newComment.save(async (error, value) => {
      if (error) {
        return next(error);
      } else {
        await Post.findByIdAndUpdate(req.params.id, {
          $push: { replies: await value._id },
        });
        res.redirect(`/post/${req.params.id}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
