const mongoose = require('mongoose');

const User = mongoose.model('users');

module.exports = async ({ email }) => {
  const user = await User.findOne({ email });
  user.approved = true;
  await user.save();
};
