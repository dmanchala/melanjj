const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const notifyAdminOfSignup = require('./notifyAdminOfSignup');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, await User.findById(id));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        done(null, existingUser);
        return;
      }

      const newUser = await User({ email });

      const err = await notifyAdminOfSignup(newUser);

      if (err) {
        done(err, newUser);
        return;
      }

      newUser.save();
      done(null, newUser);
    },
  ),
);
