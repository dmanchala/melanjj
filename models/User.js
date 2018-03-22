const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  approved: { type: Boolean, default: false },
});

mongoose.model('users', userSchema);
