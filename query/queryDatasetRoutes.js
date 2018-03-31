const requireLogin = require('../middlewares/requireLogin');
const queryDataset = require('./queryDataset');

module.exports = (app) => {
  app.get('/api/queryDataset', requireLogin, queryDataset);
};
