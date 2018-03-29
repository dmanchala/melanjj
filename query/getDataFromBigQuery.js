const BigQuery = require('@google-cloud/bigquery');
const path = require('path');
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

module.exports = (req, res, errorCallback, dataCallback, doneCallback) => {
  bigquery
    .createQueryStream(req.body.query)
    .on('error', errorCallback)
    .on('data', dataCallback)
    .on('end', doneCallback);
};
