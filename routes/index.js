const express = require('express');
const {
  get_users,
  get_user_data,
  get_timeline,
  get_image,
  get_chat,
  get_notifications,
  put_clear_notifications,
  get_connection_status,
} = require('../controllers/index-controllers');
const { verifyToken } = require('../controllers/jwt-controllers');
const {
  get_post_image,
  get_comment_image,
} = require('../controllers/post-controllers');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({
    get: [
      '/user | gets info on currently signed in user',
      '/friend_requests | gets ongoing friend request',
      '/timeline | gets sorted posts made by user & friends',
      '/users | gets a list of all users',
      '/users:<user_id> | gets a single user',
      '/auth/google | sign in/up with google',
      '/post/<post_id> | get a single post',
      '/post/comment/<comment_id> | get a single comment',
      '/post/user/<user_id> | get posts made by user',
    ],
    post: [
      '/post | create a new post',
      '/post/<post_id>/comment | create a new comment',
    ],
    put: [
      '/user | update currently signed in user info',
      '/post/<post_id> | update post',
      '/post/<post_id>/like | add/remove like on a post',
      '/post/comment/<comment_id> | update comment',
      '/post/comment/<comment_id>/like | add/remove like on a comment',
      '/user/<user_id>/fr | make a friend request',
      '/user/accept_fr/<user_id> | accept a friend request',
      '/user/decline_fr/<user_id> | decline a friend request',
    ],
    delete: [
      '/user | delete currently signed in user',
      '/post/<post_id> | delete a post',
      '/post/comment/:<comment_id> | delete a comment',
    ],
  });
});

router.get('/timeline', verifyToken, get_timeline);

router.get('/post/img/:id', get_post_image);

router.get('/comment/img/:id', get_comment_image);

router.get('/img/:id', get_image);

router.get('/users', get_users);

router.get('/users/:id', get_user_data);

router.get('/chat', get_chat);

router.get('/connection', get_connection_status);

router.get('/notifications', verifyToken, get_notifications);

router.put('/notifications', verifyToken, put_clear_notifications);

const ChatMessage = require('../models/ChatMessage');

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const io = require('socket.io')(3030, {
  cors: { origin: [process.env.CLIENT] },
});

io.on('connection', (socket, next) => {
  const token =
    socket.handshake.query.Authorization ||
    socket.handshake.query.authorization ||
    '';
  if (!token) {
    return;
  }

  jwt.verify(token, process.env.JWTSECRET, async (err, authData) => {
    if (err) {
      return;
    }
    socket.on('send-message', (message) => {
      if (message.message === '') return;
      const newChatMessage = new ChatMessage({
        author: authData.user._id,
        message: message.message.trim(),
      });
      newChatMessage.save(async (error, value) => {
        if (error) {
          return;
        } else {
          io.emit(
            'receive-message',
            await value.populate('author', 'username profile_picture'),
          );
        }
      });
    });

    socket.on('check-notifications', async () => {
      const user = await User.findById(authData.user._id);
      if (user.unread_notifications.length) {
        io.to(socket.id).emit('unread-notification', true);
      } else {
        io.to(socket.id).emit('unread-notification', false);
      }
    });
  });
});

module.exports = router;
