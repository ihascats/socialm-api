const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  redirect_success,
  get_login_key,
} = require('../controllers/google-auth-controllers');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/success',
  passport.authenticate('google', { failureRedirect: '/login' }),
  redirect_success,
);

router.get('/login/success', get_login_key);

module.exports = router;
