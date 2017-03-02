'use strict';

const mongoose = require('mongoose');
const token = require('rand-token');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const config = new Schema({
  jwtToken: { type: String, default: token.generate(16) },
  davis: { 
    url: { type: String, trim: true, required: false, index: false, default: '' },
  },
  dynatrace: {
    url: { type: String, trim: true, default: '' },
    apiUrl: { type: String, trim: true, default: '' },
    token: { type: String, trim: true, default: '' },
    strictSSL: { type: Boolean, default: true },
  },
  watson: {
    enabled: { type: Boolean, default: false },
    stt: {
      user: { type: String, trim: true, default: '' },
      password: { type: String, trim: true, default: '' },
    },
    tts: {
      user: { type: String, trim: true, default: '' },
      password: { type: String, trim: true, default: '' },
    },
  },
  slack: {
    enabled: { type: Boolean, default: false },
    clientId: { type: String, trim: true, default: '' },
    clientSecret: { type: String, trim: true, default: '' },
    redirectUri: { type: String, trim: true, default: '' },
  },
  api: {
    events: { type: String, trim: true, minlength: 16, maxlength: 32, default: token.generate(32) },
  },
});

module.exports = mongoose.model('Config', config, 'config');
