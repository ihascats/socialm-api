const express = require('express');
const {
  get_users,
  post_signup,
  upload,
  delete_user,
} = require('../controllers/index-controllers');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/users', get_users);

router.delete('/users::id', delete_user);

router.post('/signup', upload.single('profile_picture'), post_signup);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

router.get(
  '/auth/success',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);

module.exports = router;
