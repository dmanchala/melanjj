const mongoose = require('mongoose');
const CollectionSchema = require('./Collection');

const { Schema } = mongoose;

const datasetSchema = new Schema({
  name: String,
  formattedName: String,
  description: String,
  citation: String,
  source: String,
  collections: [CollectionSchema],
});

mongoose.model('Dataset', datasetSchema);
