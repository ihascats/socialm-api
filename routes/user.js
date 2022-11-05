const express = require('express');
const {
  get_auth_user_data,
  put_auth_user_data,
  delete_auth_user_data,
} = require('../controllers/auth-user-controllers');
const { verifyToken } = require('../controllers/jwt-controllers');
const { upload } = require('../controllers/multer-controllers');
const router = express.Router();

router.get('/', verifyToken, get_auth_user_data);

router.put(
  '/',
  verifyToken,
  upload.single('profile_picture'),
  put_auth_user_data,
);

router.delete('/', verifyToken, delete_auth_user_data);

module.exports = router;
