module.exports = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/google');
    return;
  }
  if (!req.user.approved) {
    res.redirect('/api/signup/thank_you');
    return;
  }

  next();
};
