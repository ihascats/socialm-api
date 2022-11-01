const express = require('express');
const {
  get_users,
  post_signup,
  upload,
  delete_user,
} = require('../controllers/index-controllers');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('/');
});

router.get('/users', get_users);

router.delete('/users::id', delete_user);

router.post('/signup', upload.single('profile_picture'), post_signup);

module.exports = router;
