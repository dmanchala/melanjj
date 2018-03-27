const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const requireAdmin = require('../middlewares/requireAdmin');
const requireLogin = require('../middlewares/requireLogin');
const notifyUserOfApproval = require('../services/notifyUserOfApproval');

const User = mongoose.model('users');

module.exports = (app) => {
  app.get(
    '/auth/google/',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    requireLogin,
    (req, res) => {
      res.redirect(`${keys.redirectDomain}/`);
    },
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/signup-thank-you', (req, res) => {
    res.send(
      "Thank you for signing up. We'll email you when your account is ready.",
    );
  });

  app.get('/api/admin/users/:id/approve', requireAdmin, async (req, res) => {
    const user = await User.findById(req.params.id);
    user.approved = true;
    await user.save();
    notifyUserOfApproval(user.email);
    res.send(user);
  });
};
