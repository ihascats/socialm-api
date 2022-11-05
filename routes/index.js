const express = require('express');
const {
  get_users,
  upload,
  delete_user,
  get_login_key,
  verifyToken,
  get_auth_user_data,
  redirect_success,
  get_user_data,
  put_auth_user_data,
} = require('../controllers/index-controllers');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/users', get_users);

router.get('/user', verifyToken, get_auth_user_data);

router.put(
  '/user',
  verifyToken,
  upload.single('profile_picture'),
  put_auth_user_data,
);

router.get('/user::id', get_user_data);

router.delete('/users::id', delete_user);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

router.get(
  '/auth/success',
  passport.authenticate('google', { failureRedirect: '/login' }),
  redirect_success,
);

router.get('/login/success', get_login_key);

module.exports = router;
