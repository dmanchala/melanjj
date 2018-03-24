module.exports = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(404).send();
  }

  next();
  return undefined;
};
