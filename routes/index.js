const express = require('express');
const {
  get_users,
  get_user_data,
} = require('../controllers/index-controllers');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(req.user);
});

router.get('/users', get_users);

router.get('/users::id', get_user_data);

module.exports = router;
