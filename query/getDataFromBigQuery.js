/* eslint func-names: 0 */
/* eslint space-before-function-paren: 0 */

const BigQuery = require('@google-cloud/bigquery');
const path = require('path');
const through2 = require('through2');
const fs = require('fs');
const keys = require('../config/keys');

const bigquery = new BigQuery({
  projectId: keys.googleCloudProjectId,
  keyFilename: path.resolve(
    __dirname,
    '..',
    'config',
    'melanjj-dev-c82a2fe5047c.json',
  ),
});

// 'SELECT url FROM `bigquery-public-data.samples.github_nested` LIMIT 10';

// const bigQueryDryRun = async (query) => {
//   await
// }

module.exports = async (
  req,
  res,
  dryRunCallback,
  errorCallback,
  dataCallback,
  doneCallback,
) => {
  await bigquery.createQueryJob(
    {
      query: req.body.query,
      dryRun: true,
    },
    dryRunCallback,
  );
};
