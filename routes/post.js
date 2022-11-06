const express = require('express');
const { verifyToken } = require('../controllers/jwt-controllers');
const { upload } = require('../controllers/multer-controllers');
const router = express.Router();
const {
  post_new_post,
  get_user_posts,
  get_post,
  put_post,
  post_permission_check,
  delete_post,
} = require('../controllers/post-controllers');

router.post('/', verifyToken, upload.single('image'), post_new_post);

router.get('/user::id', get_user_posts);

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
