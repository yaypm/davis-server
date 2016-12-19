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

const stateEnum = {
  values: ['open', 'resolved'],
  message: '`{VALUE}` is an invalid problem state.  Please use either open or resolved.',
};

const impactEnum = {
  values: ['application', 'service', 'infrastructure'],
  message: '`{VALUE}` is an invalid problem state. Please use application, service or infrastructure.',
};

const slackNotificationRules = new Schema({
  name: { type: String, trim: true, required: true },
  enabled: { type: Boolean, default: true },
  timezone: { type: String, trim: true, enum: timezoneEnum, default: 'Etc/UTC' },
  state: [{ type: String, trim: true, enum: stateEnum }],
  impact: [{ type: String, trim: true, enum: impactEnum }],
  tags: {
    includes: [{ type: String }],
    excludes: [{ type: String }],
  },
});

const config = new Schema({
  jwtToken: { type: String, default: token.generate(16) },
  dynatrace: {
    url: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    apiUrl: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    token: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    strictSSL: { type: Boolean, required: false, unique: false, index: false, default: true },
  },
  watson: {
    enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
    stt: {
      user: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
      password: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    },
    tts: {
      user: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
      password: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    },
  },
  slack: {
    enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
    clientId: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    clientSecret: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    redirectUri: { type: String, trim: true, required: false, unique: false, index: false, default: '' },
    notifications: {
      enabled: { type: Boolean, required: false, unique: false, index: false, default: false },
      rules: [slackNotificationRules],
    },
  },
  api: {
    events: { type: String, trim: true, minlength: 16, maxlength: 16, default: token.generate(16) },
  },
});

module.exports = mongoose.model('Config', config, 'config');
