const { signToken } = require('./jwt-controllers');

exports.redirect_success = function (req, res) {
  // Successful authentication, redirect home.
  res.redirect(
    `${process.env.CLIENT}/signUp/${signToken(
      { user: req.user },
      {
        expiresIn: '16d',
      },
    )}`,
  );
};
