/* eslint func-names: 0 */
/* eslint space-before-function-paren: 0 */

const mongoose = require('mongoose');
const c = require('../full_stack/constants');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  approved: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  dateCreated: { type: Date, default: new Date() },
  computeBytesUsedThisMonth: { type: Number, default: 0 },
  apiRequestsMadeToday: { type: Number, default: 0 },
});

userSchema.methods.remainingComputeBytesThisMonth = function() {
  return Math.max(
    c.USER_MONTHLY_COMPUTE_BYTES_LIMIT - this.computeBytesUsedThisMonth,
    0,
  );
};

mongoose.model('users', userSchema);
