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

module.exports.queryDataset = async (req, res) => {
  req.user.apiRequestsMadeToday += 1;
  const user = await req.user.save();

  const { query } = req.body;

  if (req.user.computeBytesUsedThisMonth > c.USER_MONTHLY_COMPUTE_BYTES_LIMIT) {
    res
      .status(403)
      .send({ message: c.errorStrings.COMPUTE_BYTES_LIMIT_EXCEEDED });
    return;
  } else if (req.user.apiRequestsMadeToday >= c.USER_DAILY_API_REQUEST_LIMIT) {
    res
      .status(403)
      .send({ message: c.errorStrings.API_REQUEST_LIMIT_EXCEEDED });
    return;
  } else if (!query) {
    res.status(400).send({ message: c.errorStrings.EMPTY_QUERY });
    return;
  }

  const defaultDataset = {
    datasetId: 'million_song_dataset',
    projectId: 'melanjj-datasets-prod-199706',
  };

  bigquery.createQueryJob(
    {
      query,
      defaultDataset,
      dryRun: true,
    },
    async (dryRunErr) => {
      if (dryRunErr) {
        console.log(query);
        res.status(dryRunErr.code).send({
          reason: dryRunErr.errors[0].reason,
          message: dryRunErr.message,
        });
        return;
      }

      bigquery
        .createQueryJob({
          query,
          defaultDataset,
          maximumBytesBilled:
            c.USER_MONTHLY_COMPUTE_BYTES_LIMIT - user.bytesProcessedThisMonth,
        })
        .then((data) => {
          const apiResponse = data[1];
          const err = apiResponse.status.errorResult;

          if (err) {
            res.status(400).send(err);
            return;
          }

          const job = data[0];
          req.session.jobId = job.id;

          res.status(200).end();
        });

      // 'SELECT title, duration FROM `melanjj-datasets-prod-199706.million_song_dataset.main` LIMIT 1000000';

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

      // res.setHeader('Content-disposition', 'inline;filename=res.csv');
      // res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      // res.flushHeaders();

      // const csvStream = csv.createWriteStream({ headers: true });
      // csvStream.pipe(res);

      // bigquery.query(query, { timeoutMs: 60000 }, (err, rows) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }

      //   rows.forEach((row) => {
      //     csvStream.write(row);
      //   });
      // });
    },
  );
};

module.exports.downloadDataset = (req, res) => {
  if (!req.session.jobId) {
    res.status(404).end();
  }

  res.setHeader('Content-disposition', 'inline;filename=res.csv');
  res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  res.flushHeaders();

  const csvStream = csv.createWriteStream({ headers: true });
  csvStream.pipe(res);

  const job = bigquery.job(req.session.jobId);
  req.session.jobId = null;
  job.getQueryResultsStream().pipe(csvStream);
};
