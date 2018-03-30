const requireLogin = require('../middlewares/requireLogin');
const queryDataset = require('./queryDataset');
const getDataFromBigQuery = require('./getDataFromBigQuery');

module.exports = (app) => {
  app.get(
    '/api/queryDataset',
    // requireLogin,
    queryDataset(getDataFromBigQuery),
  );
};
