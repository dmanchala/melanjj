/* eslint func-names: 0 */
/* eslint space-before-function-paren: 0 */

const BigQuery = require('@google-cloud/bigquery');
const path = require('path');
const csv = require('fast-csv');
const keys = require('../config/keys');
const c = require('../full_stack/constants');

const bigquery = new BigQuery({
  projectId: keys.googleCloudProjectId,
  keyFilename: path.resolve(
    __dirname,
    '..',
    'config',
    'bigquery-service-account-key.json',
  ),
});

const scrubProjectName = (string) =>
  string.replace('melanjj-datasets-prod-199706', '');

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
    async (dryRunErr, dryRunJob) => {
      if (dryRunErr) {
        res.status(dryRunErr.code).send({
          reason: scrubProjectName(dryRunErr.errors[0].reason),
          message: scrubProjectName(dryRunErr.message),
        });
        return;
      }

      const totalBytesProcessed = Number(
        dryRunJob.metadata.statistics.query.totalBytesProcessed,
      );
      const remainingComputeBytesBeforeJob = user.remainingComputeBytesThisMonth();

      if (totalBytesProcessed > remainingComputeBytesBeforeJob) {
        res.status(400).send({
          message:
            'The query exceeds your monthly compute bytes limit. Please try again.',
        });
        return;
      }

      user.computeBytesUsedThisMonth += totalBytesProcessed;
      await user.save();

      bigquery
        .createQueryJob({
          query,
          defaultDataset,
          maximumBytesBilled: remainingComputeBytesBeforeJob,
        })
        .then((data) => {
          const apiResponse = data[1];
          const err = apiResponse.status.errorResult;

          if (err) {
            res.status(400).send(scrubProjectName(err));
            return;
          }

          const job = data[0];
          req.session.jobId = job.id;

          res.status(200).end();
        });
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
