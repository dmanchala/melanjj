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

const userValid1 = {
  email: 'userValid1@gmail.com',
  approved: true,
  admin: false,
  dateCreated: new Date(),
  bandwidthInBytesConsumedThisMonth: 0,
  apiRequestsMadeToday: 0,
};

describe('datasetQuery', function() {
  before(async function() {
    await User.deleteMany({});
    await User.insertMany([
      userBandwidthQuotaExceeded,
      userApiRequestLimitExceeded,
      userValid1,
    ]);
  });

  describe('datasetQuery', function() {
    it('should reject a user who has exceeded her bandwidth quota', async function() {
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
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount + 1);
    });

    it('should reject a user who has exceeded her api request limit', async function() {
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
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount + 1);
    });

    it('should reject an empty query', async function() {
      const req = {
        body: { query: '' },
      };
      const { email } = userValid1;
      req.user = await User.findOne({
        email,
      });
      const originalApiRequestCount = req.user.apiRequestsMadeToday;
      const res = new MockExpressResponse();

      await queryDataset(() => {})(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res._getString()).to.equal(c.errorStrings.EMPTY_QUERY);

      const user = await User.findOne({ email });
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount + 1);
    });

    it('should return BigQuery error codes and messages', async function() {
      const badQuery = 'Bad Query';
      const req = {
        body: { query: badQuery },
      };
      const { email } = userValid1;
      req.user = await User.findOne({
        email,
      });
      const originalApiRequestCount = req.user.apiRequestsMadeToday;
      const res = new MockExpressResponse();
      const bigQueryError = {
        code: 400,
        message: 'Syntax error: Unexpected identifier "Bad" at [1:1]',
      };

      await queryDataset((req, res, errorCallback) => {
        errorCallback(bigQueryError);
      })(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res._getString()).to.equal(bigQueryError.message);

      const user = await User.findOne({ email });
      expect(user.apiRequestsMadeToday).to.equal(originalApiRequestCount + 1);
    });
  });
});
