const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  approved: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  dateCreated: { type: Date, default: new Date() },
  bandwidthInBytesConsumedThisMonth: { type: Number, default: 0 },
  apiRequestsMadeToday: { type: Number, default: 0 },
});

mongoose.model('users', userSchema);
