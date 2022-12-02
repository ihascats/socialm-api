const express = require('express');
const { verifyToken } = require('../controllers/jwt-controllers');
const { upload } = require('../controllers/multer-controllers');
const router = express.Router();
const {
  post_new_post,
  get_user_posts_comments,
  get_post,
  put_post,
  post_permission_check,
  comment_permission_check,
  delete_post,
  delete_comment,
  put_like,
  post_comment,
  put_comment,
  put_comment_like,
  get_comment,
  comment_validate,
  post_validate,
} = require('../controllers/post-controllers');

router.post(
  '/:id/comment',
  verifyToken,
  upload.single('image'),
  comment_validate,
  post_comment,
);

router.get('/comment/:id', get_comment);

router.delete(
  '/comment/:id/:path',
  verifyToken,
  comment_permission_check,
  delete_comment,
);

router.put('/comment/:id/like', verifyToken, put_comment_like);

router.put(
  '/comment/:id',
  verifyToken,
  upload.single('image'),
  comment_validate,
  comment_permission_check,
  put_comment,
);

router.post(
  '/',
  verifyToken,
  upload.single('image'),
  post_validate,
  post_new_post,
);

router.get('/user/:id', get_user_posts_comments);

router.put('/:id/like', verifyToken, put_like);

router.get('/:id', get_post);

router.put(
  '/:id',
  verifyToken,
  upload.single('image'),
  post_validate,
  post_permission_check,
  put_post,
);

router.delete('/:id/:path', verifyToken, post_permission_check, delete_post);

module.exports = router;
