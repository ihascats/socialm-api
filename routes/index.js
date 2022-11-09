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
  res.send(req.user);
});

router.get('/timeline', verifyToken, get_timeline);

router.get('/users', get_users);

router.get('/users::id', get_user_data);

module.exports = router;
