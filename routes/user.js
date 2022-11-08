const express = require('express');
const {
  get_auth_user_data,
  put_auth_user_data,
  delete_auth_user_data,
  username_validate,
  put_friend_request,
  put_accept_friend_request,
  put_decline_friend_request,
} = require('../controllers/auth-user-controllers');
const { verifyToken } = require('../controllers/jwt-controllers');
const { upload } = require('../controllers/multer-controllers');
const router = express.Router();

router.get('/', verifyToken, get_auth_user_data);

router.put('/fr::id', verifyToken, put_friend_request);

router.put('/accept_fr::id', verifyToken, put_accept_friend_request);

router.put('/decline_fr::id', verifyToken, put_decline_friend_request);

router.put(
  '/',
  verifyToken,
  username_validate,
  upload.single('profile_picture'),
  put_auth_user_data,
);

router.delete('/', verifyToken, delete_auth_user_data);

module.exports = router;
