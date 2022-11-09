const express = require('express');
const {
  get_users,
  get_user_data,
  get_timeline,
} = require('../controllers/index-controllers');
const { verifyToken } = require('../controllers/jwt-controllers');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({
    get: [
      '/user',
      '/friend_requests',
      '/timeline',
      '/users',
      '/users:<id>',
      '/auth/google',
      '/post/<post_id>',
      '/post/comment:<comment_id>',
      '/post/user:<user_id>',
    ],
    post: ['/post', '/post/comment:<post_id>'],
    put: [
      '/post/<post_id>',
      '/post/like:<post_id>',
      '/post/comment/:<comment_id>',
      '/post/comment/like:<comment_id>',
      '/user',
      '/fr:<user_id>',
      '/accept_fr:<user_id>',
      '/decline_fr:<user_id>',
    ],
    delete: ['/user', '/post/<post_id>', '/post/comment/:<comment_id>'],
  });
});

router.get('/timeline', verifyToken, get_timeline);

router.get('/users', get_users);

router.get('/users::id', get_user_data);

module.exports = router;
