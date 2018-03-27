const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.post('/api/graphql', requireLogin, (req, res) => {
    console.log(req.body);
    res.send('Success.');
  });
};
