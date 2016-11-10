'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const token = require('rand-token').generator({
  chars: 'A-Z',
  source: crypto.randomBytes,
});

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const AlexaSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  applicationId: { type: String, required: true, unique: false },
  friendlyToken: {
    type: String,
    maxlength: 6,
    default: () => { return token.generate(6); }, // eslint-disable-line arrow-body-style
  },
  timesAccessed: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Alexa', AlexaSchema);
