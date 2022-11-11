const express = require('express');
const router = express.Router();
const passport = require('passport');
const { redirect_success } = require('../controllers/google-auth-controllers');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/success',
  passport.authenticate('google', { failureRedirect: '/login' }),
  redirect_success,
);

module.exports = router;
