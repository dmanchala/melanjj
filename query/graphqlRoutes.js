const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.get('/api/graphql', requireLogin, (req, res) => {
    res.send('Success.');
  });
};
