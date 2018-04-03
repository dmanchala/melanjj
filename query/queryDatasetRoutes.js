const requireLogin = require('../middlewares/requireLogin');
const { queryDataset, downloadDataset } = require('./queryDataset');

module.exports = (app) => {
  app.post('/api/queryDataset', requireLogin, queryDataset);
  app.get('/api/downloadDataset', requireLogin, downloadDataset);
};
