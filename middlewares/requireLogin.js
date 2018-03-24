module.exports = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/auth/google');
  }
  if (!req.user.approved) {
    return res.send(
      "Thank you for having signed up. We'll approve you shortly and notify you by email.",
    );
  }

  next();
  return undefined;
};
