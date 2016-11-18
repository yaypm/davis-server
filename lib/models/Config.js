'use strict';

const mongoose = require('mongoose');
const token = require('rand-token');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const timezone = require('../config/timezones');

const timezoneEnum = {
  values: timezone,
  message: '`{VALUE}` is an invalid timezone',
};

const config = new Schema({
  jwtToken: { type: String, default: token.generate(16) },
  dynatrace: {
    url: { type: String, required: false, unique: false, index: false, default: '' },
    apiUrl: { type: String, required: false, unique: false, index: false, default: '' },
    token: { type: String, required: false, unique: false, index: false, default: '' },
    strictSSL: { type: Boolean, required: false, unique: false, index: false, default: true },
  },
  watson: {
    enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
    stt: {
      user: { type: String, required: false, unique: false, index: false, default: '' },
      password: { type: String, required: false, unique: false, index: false, default: '' },
    },
    tts: {
      user: { type: String, required: false, unique: false, index: false, default: '' },
      password: { type: String, required: false, unique: false, index: false, default: '' },
    },
  },
  slack: {
    enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
    clientId: { type: String, required: false, unique: false, index: false, default: '' },
    clientSecret: { type: String, required: false, unique: false, index: false, default: '' },
    redirectUri: { type: String, required: false, unique: false, index: false, default: '' },
    notifications: {
      enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
      rules: [
        {
          id: {
            type: String,
            minlength: 16,
            maxlength: 16,
            default: () => { return token.generate(6); }, // eslint-disable-line arrow-body-style
          },
          team: { type: String },
          name: { type: String },
          enabled: { type: Boolean, default: true },
          timezone: { type: String, enum: timezoneEnum, default: 'Etc/UTC' },
          state: { type: String },
          impact: { type: String },
          tags: {
            includes: [{ type: String }],
            excludes: [{ type: String }],
          },
        },
      ],
    },
  },
  api: {
    events: { type: String, minlength: 16, maxlength: 16, default: token.generate(16) },
  },
});

module.exports = mongoose.model('Config', config, 'config');
