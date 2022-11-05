const { signToken } = require('./jwt-controllers');

exports.get_login_key = function (req, res, next) {
  if (req.user) {
    res.send(
      signToken(
        { user: req.user },
        {
          expiresIn: '16d',
        },
      ),
    );
  } else {
    res.send({ status: 'Invalid login' });
  }
};

exports.redirect_success = function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/auth/login/success');
};
