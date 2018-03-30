/* eslint func-names: 0 */
/* eslint space-before-function-paren: 0 */

const BigQuery = require('@google-cloud/bigquery');
const path = require('path');
const through2 = require('through2');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('fast-csv');
const keys = require('../config/keys');
const c = require('../full_stack/constants');

const bigquery = new BigQuery({
  projectId: keys.googleCloudProjectId,
  keyFilename: path.resolve(
    __dirname,
    '..',
    'config',
    'melanjj-dev-c82a2fe5047c.json',
  ),
});

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

module.exports = (getDataFromBigQuery) => async (req, res, next) => {
  // req.user.apiRequestsMadeToday += 1;
  // await req.user.save();

  // if (req.user.bytesProcessedThisMonth > c.USER_MONTHLY_COMPUTE_BYTES_LIMIT) {
  //   res.status(403).send(c.errorStrings.COMPUTE_BYTES_LIMIT_EXCEEDED);
  //   return;
  // } else if (req.user.apiRequestsMadeToday >= c.USER_DAILY_API_REQUEST_LIMIT) {
  //   res.status(403).send(c.errorStrings.API_REQUEST_LIMIT_EXCEEDED);
  //   return;
  // } else if (!req.body.query) {
  //   res.status(400).send(c.errorStrings.EMPTY_QUERY);
  //   return;
  // }

  const { query } = req.query;

  bigquery.createQueryJob(
    {
      query,
      dryRun: true,
    },
    async (dryRunErr, dryRunJob) => {
      if (dryRunErr) {
        console.log(dryRunErr);
        res.status(dryRunErr.code).send({
          reason: dryRunErr.errors[0].reason,
          message: dryRunErr.message,
        });
        return;
      }

      // 'SELECT url FROM `bigquery-public-data.samples.github_nested` LIMIT 10';

      // const totalBytesProcessed = Number(
      //   dryRunJob.metadata.statistics.query.totalBytesProcessed,
      // );
      // const user = await User.findById(req.user.id);

      // if (
      //   user.bytesProcessedThisMonth + totalBytesProcessed >
      //   c.USER_MONTHLY_COMPUTE_BYTES_LIMIT
      // ) {
      //   res
      //     .status(403)
      //     .send(c.errorStrings.COMPUTE_BYTES_LIMIT_WOULD_BE_EXCEEDED);
      //   return;
      // }

      // user.bytesProcessedThisMonth += totalBytesProcessed;
      // await user.save();

      res.setHeader('Content-disposition', 'inline;filename=res.csv');
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.flushHeaders();

      const csvStream = csv.createWriteStream({ headers: true });
      csvStream.pipe(fs.createWriteStream('test2.csv'));
      // csvStream.pipe(res);

      console.log('here');

      let count = 0;

      bigquery.query(query, { timeoutMs: 120000 }, (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log('here');

        rows.forEach((row) => {
          console.log(count, row);
          count += 1;
        });
      });

      // bigquery
      //   .createQueryStream({
      //     query,
      //     timeoutMs: 1000,
      //   })
      //   .on('error', (queryErr) => {
      //     console.log(queryErr);
      //     res.status(queryErr.code).send(queryErr);
      //   })
      //   .on('data', (row) => {
      //     csvStream.write(row);
      //   })
      //   .on('end', () => {
      //     csvStream.end();
      //   });
    },
  );
};
