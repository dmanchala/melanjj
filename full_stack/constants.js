const USER_MONTHLY_BANDWIDTH_QUOTA_IN_BYTES = 100 * 1000 * 1000 * 1000;
const USER_DAILY_API_REQUEST_LIMIT = 10;
const errorStrings = {
  BANDWIDTH_QUOTA_EXCEEDED: 'Bandwidth quota exceeded.',
  API_REQUEST_LIMIT_EXCEEDED: 'API request limit exceeded.',
};

module.exports = {
  USER_MONTHLY_BANDWIDTH_QUOTA_IN_BYTES,
  USER_DAILY_API_REQUEST_LIMIT,
  errorStrings,
};
