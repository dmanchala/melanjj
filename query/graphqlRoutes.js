const requireLogin = require('../middlewares/requireLogin');
const constants = require('../full_stack/constants');

const { USER_MONTHLY_BANDWIDTH_QUOTA_IN_BYTES } = constants;

module.exports = (app) => {
  app.post('/api/graphql', requireLogin, (req, res) => {
    console.log(req);

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
  });
};
