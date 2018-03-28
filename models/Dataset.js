const mongoose = require('mongoose');

const { Schema } = mongoose;

const datasetSchema = new Schema({
  name: String,
  formattedName: String,
  description: String,
  citation: String,
  source: String,
});

mongoose.model('Dataset', datasetSchema);
