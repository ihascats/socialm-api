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
} = require('../controllers/post-controllers');

router.post('/comment::id', verifyToken, upload.single('image'), post_comment);

router.get('/comment::id', get_comment);

router.delete(
  '/comment/:id',
  verifyToken,
  comment_permission_check,
  delete_comment,
);

router.put('/comment/like::id', verifyToken, put_comment_like);

router.put(
  '/comment/:id',
  verifyToken,
  upload.single('image'),
  comment_permission_check,
  put_comment,
);

router.post('/', verifyToken, upload.single('image'), post_new_post);

router.get('/user::id', get_user_posts_comments);

router.put('/like::id', verifyToken, put_like);

router.get('/:id', get_post);

router.put(
  '/:id',
  verifyToken,
  upload.single('image'),
  post_permission_check,
  put_post,
);

router.delete('/:id', verifyToken, post_permission_check, delete_post);

module.exports = router;
