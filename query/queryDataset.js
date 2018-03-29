const mongoose = require('mongoose');
const c = require('../full_stack/constants');

const User = mongoose.model('users');
/*
    !!!! Database access must be read only !!!!
    !!!! Refactor so that BigQuery service can be mocked and the rest of the code can be unit tested !!!!
    if user has exceeded their bandwidth quota, block them
    if user has exceeded their API quota, block them
    get dataset name
    get collection name
    initialize BigQuery
    connect to collection table in dataset in BigQuery
    get query
    create a log object
      write query to log object
    make query
      set timeout
    write to log object
    update user's API quota
    if error:
      write to log object
      if invalid query:
        notify user
      if user attempts to write:
        notify user
      if some other error:
        apologize
      return
    if job timed out:
      write to log object
      notify user
      return
    write to log object
    calculate necessary bandwidth
    if user will exceed their bandwidth quota, notify them and return
    update user's bandwidth quota
    initialize csv stream writer
    set download content headers
    stream results into csv writer
    stream csv writer into response
    end response
    */

module.exports = (getDataFromBigQuery) => async (req, res) => {
  req.user.apiRequestsMadeToday += 1;
  await req.user.save();

  if (
    req.user.bandwidthInBytesConsumedThisMonth >=
    c.USER_MONTHLY_BANDWIDTH_QUOTA_IN_BYTES
  ) {
    res.status(403).send(c.errorStrings.BANDWIDTH_QUOTA_EXCEEDED);
    return;
  } else if (req.user.apiRequestsMadeToday >= c.USER_DAILY_API_REQUEST_LIMIT) {
    res.status(403).send(c.errorStrings.API_REQUEST_LIMIT_EXCEEDED);
    return;
  } else if (!req.body.query) {
    res.status(400).send(c.errorStrings.EMPTY_QUERY);
    return;
  }

  getDataFromBigQuery(
    req,
    res,
    (error) => {
      res.status(error.code).send(error.message);
    },
    (row) => {
      console.log(row);
    },
    () => {
      console.log('done');
    },
  );
};
