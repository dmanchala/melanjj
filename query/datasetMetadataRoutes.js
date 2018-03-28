const mongoose = require('mongoose');
const Dataset = mongoose.model('Dataset');

module.exports = (app) => {
  app.get('/api/datasets/:username/:dataset', async (req, res) => {
    const dataset = await Dataset.findOne({ name: req.params.dataset }).lean();
    res.send(JSON.stringify(dataset));
  });
};
