const USER_MONTHLY_COMPUTE_BYTES_LIMIT = 10 * 1000 * 1000 * 1000;
const USER_DAILY_API_REQUEST_LIMIT = 10000;
const errorStrings = {
  API_REQUEST_LIMIT_EXCEEDED: 'API request limit exceeded.',
  COMPUTE_BYTES_LIMIT_EXCEEDED: 'Compute bytes limit exceeded.',
  COMPUTE_BYTES_LIMIT_WOULD_BE_EXCEEDED:
    'Executing this query would exceed the compute bytes limit.',
  EMPTY_QUERY: 'Query was empty.',
};

module.exports = {
  USER_MONTHLY_COMPUTE_BYTES_LIMIT,
  USER_DAILY_API_REQUEST_LIMIT,
  errorStrings,
};
