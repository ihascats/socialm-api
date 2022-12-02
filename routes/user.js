const express = require('express');
const {
  get_auth_user_data,
  put_auth_user_data,
  delete_auth_user_data,
  username_validate,
  put_friend_request,
  put_accept_friend_request,
  put_decline_friend_request,
  get_friend_requests,
  request_check,
  put_remove_friend,
  get_outgoing_friend_requests,
} = require('../controllers/auth-user-controllers');
const { verifyToken } = require('../controllers/jwt-controllers');
const { upload } = require('../controllers/multer-controllers');
const router = express.Router();

router.get('/', verifyToken, get_auth_user_data);

router.get('/friend_requests', verifyToken, get_friend_requests);

router.get('/outgoingFr', verifyToken, get_outgoing_friend_requests);

router.put('/:id/fr', verifyToken, request_check, put_friend_request);

router.put('/accept_fr/:id', verifyToken, put_accept_friend_request);

router.put('/decline_fr/:id', verifyToken, put_decline_friend_request);

router.put('/remove_fr/:id', verifyToken, put_remove_friend);

router.put(
  '/',
  verifyToken,
  upload.single('profile_picture'),
  username_validate,
  put_auth_user_data,
);

router.delete('/', verifyToken, delete_auth_user_data);

module.exports = router;
