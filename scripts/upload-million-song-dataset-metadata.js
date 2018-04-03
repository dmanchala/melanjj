const mongoose = require('mongoose');
const keys = require('../config/keys');
require('../models/Dataset');

mongoose.connect(keys.mongoUri);
const Dataset = mongoose.model('Dataset');

(async () => {
  const dataset = await Dataset.findOne({});
  dataset.collections[0].description =
    'The table containing the entire data of the million song dataset.';
  await dataset.save();
  mongoose.disconnect();
})();
