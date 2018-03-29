const requireLogin = require('../middlewares/requireLogin');
const queryDataset = require('./queryDataset');
const getDataFromBigQuery = require('./getDataFromBigQuery');

module.exports = (app) => {
  app.post(
    '/api/queryDataset',
    requireLogin,
    queryDataset(getDataFromBigQuery),
  );
};
