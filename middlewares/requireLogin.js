module.exports = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/google');
    return;
  }
  if (!req.user.approved) {
    res.redirect('/signup-thank-you');
    return;
  }

  next();
};
