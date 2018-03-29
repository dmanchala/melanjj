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

// 'SELECT * FROM `bigquery-public-data.samples.github_nested` LIMIT 10';

module.exports = async (
  req,
  res,
  errorCallback,
  dataCallback,
  doneCallback,
) => {
  const data = await bigquery.createQueryJob({
    query: req.body.query,
    dryRun: true,
  });
  const job = data[0];
  job.getQueryResults((err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(rows);
  });
  // .createQueryStream({ query: req.body.query, dryRun: true })
  // .on('error', (error) => {
  //   console.log(error.code, error.message);
  //   res.status(error.code).send(error.message);
  // })
  // .on('data', dataCallback)
  // .on('end', doneCallback);
};
