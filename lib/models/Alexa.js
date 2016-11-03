'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const AlexaSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  applicationId: { type: String, required: true, unique: false },
  timesAccessed: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Alexa', AlexaSchema);
