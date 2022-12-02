const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const User = require('./models/User');
const passport = require('passport');
const session = require('express-session');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const googleRouter = require('./routes/google-auth');
const postRouter = require('./routes/post');

const app = express();
app.use(cors());

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_CONNECTION,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.');
      const testFolder = './public/images';
      const fs = require('fs');
      const Users = require('./models/User');
      const Posts = require('./models/Posts');
      const Comments = require('./models/Comments');
      const path = require('path');

      fs.readdir(testFolder, (err, files) => {
        const images = files.filter((file) => {
          if (file !== 'no-image.png') return file;
        });
        images.forEach(async (image) => {
          const userProfilePicture = await Users.find({
            profile_picture: image,
          });
          const postImage = await Posts.find({ image });
          const commentImage = await Comments.find({ image });
          if (
            !userProfilePicture.length &&
            !postImage.length &&
            !commentImage.length
          ) {
            console.log(image);
            const deletePath = path.join(
              __dirname,
              '.',
              'public',
              'images',
              image,
            );
            fs.unlink(deletePath, (err) => {
              if (err) {
                throw err;
              }
              console.log('Delete File successfully.');
            });
          }
        });
      });
    } else {
      console.log('Error in DB connection: ' + err);
    }
  },
);

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/success',
    },
    async function (accessToken, refreshToken, profile, done) {
      // Wouldn't have been able to make it work without https://github.com/DoviMaj/fakebook-server
      let user = await User.findOne({ googleId: profile.id });
      const userData = {
        username: profile.displayName,
        profile_picture: profile.photos[0].value,
        googleId: profile.id,
      };
      user ? null : (user = await User.create(userData));
      return done(null, user);
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', googleRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
