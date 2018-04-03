const mongoose = require('mongoose');
const keys = require('../config/keys');
require('../models/Dataset');

mongoose.connect(keys.mongoUri);
const Dataset = mongoose.model('Dataset');

(async () => {
  const dataset = await Dataset.findOne({});
  dataset.description = `The million song dataset consists of the audio features and metadata for one million contemporary songs.

  **Citation**
  
      Thierry Bertin-Mahieux, Daniel P.W. Ellis, Brian Whitman, and Paul Lamere. 
      The Million Song Dataset. In Proceedings of the 12th International Society
      for Music Information Retrieval Conference (ISMIR 2011), 2011.
  
  [Source](https://labrosa.ee.columbia.edu/millionsong/)`;
  const updatedDataset = await dataset.save();
  console.log(updatedDataset);
  mongoose.disconnect();
})();
