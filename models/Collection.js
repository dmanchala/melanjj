const mongoose = require('mongoose');

const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: String,
  description: String,
  columns: Object,
});

module.exports = collectionSchema;
