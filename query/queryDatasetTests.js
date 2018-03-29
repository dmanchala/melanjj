/* eslint space-before-function-paren: 0 */
/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-underscore-dangle: 0 */

process.env.NODE_ENV = 'test';

const { describe, it, after } = require('mocha');
const { expect } = require('chai');
const MockExpressResponse = require('mock-express-response');
const mongoose = require('mongoose');
require('../models/User');
const queryDataset = require('./queryDataset');
const c = require('../full_stack/constants');
const keys = require('../config/keys');

mongoose.connect(keys.mongoUri);
const User = mongoose.model('users');

const userBandwidthQuotaExceeded = {
  email: 'userBandwidthQuotaExceeded@gmail.com',
  approved: true,
  admin: false,
  dateCreated: new Date(),
  bandwidthInBytesConsumedThisMonth:
    c.USER_MONTHLY_BANDWIDTH_QUOTA_IN_BYTES + 1,
  apiRequestsMadeToday: 1,
};

const userApiRequestLimitExceeded = {
  email: 'userApiRequestLimitExceeded@gmail.com',
  approved: true,
  admin: false,
  dateCreated: new Date(),
  bandwidthInBytesConsumedThisMonth: 1,
  apiRequestsMadeToday: c.USER_DAILY_API_REQUEST_LIMIT + 1,
};

describe('datasetQuery', function() {
  before(async function() {
    await User.deleteMany({});
    await User.insertMany([
      userBandwidthQuotaExceeded,
      userApiRequestLimitExceeded,
    ]);
  });

  describe('datasetQuery', function() {
    it('should block a user who has exceeded her bandwidth quota', async function() {
      const req = {};
      const { email } = userBandwidthQuotaExceeded;
      req.user = await User.findOne({
        email,
      });
      const originalApiRequestCount = req.user.apiRequestsMadeToday;
      const res = new MockExpressResponse();

      await queryDataset(() => {})(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res._getString()).to.equal(
        c.errorStrings.BANDWIDTH_QUOTA_EXCEEDED,
      );

      const user = await User.findOne({ email });
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount);
    });

    it('should block a user who has exceeded her api request limit', async function() {
      const req = {};
      const { email } = userApiRequestLimitExceeded;
      req.user = await User.findOne({
        email,
      });
      const originalApiRequestCount = req.user.apiRequestsMadeToday;
      const res = new MockExpressResponse();

      await queryDataset(() => {})(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res._getString()).to.equal(
        c.errorStrings.API_REQUEST_LIMIT_EXCEEDED,
      );

      const user = await User.findOne({ email });
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount);
    });
  });
});
