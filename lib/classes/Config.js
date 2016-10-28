'use strict';

const _ = require('lodash');
const path = require('path');

class Config {
  constructor(davis, config) {
    this.davis = davis;
    this.davisPath = path.join(__dirname, '..');

    if (config) this.update(config);
  }

  getDavisIP() {
    return this.ip || process.env.IP || '127.0.0.1';
  }

  getDavisPort() {
    return this.port || process.env.PORT || 3000;
  }

  getMongoDBConnectionString() {
    return _.get(this, 'database.dns') || process.env.MONGODB_URI || 'mongodb://localhost/davis';
  }

  getDynatraceUrl() {
    return _.get(this, 'dynatrace.url') || process.env.DYNATRACE_URL;
  }

  getDynatraceKey() {
    return _.get(this, 'dynatrace.key') || process.env.DYNATRACE_KEY;
  }

  getDynatraceValidateCert() {
    return _.get(this, 'dynatrace.strictSSL') || process.env.DYNATRACE_STRICT_SSL || false;
  }

  isWatsonEnabled() {
    return _.get(this, 'watson.enabled', false);
  }

  getWatsonTtsUser() {
    return _.get(this, 'watson.tts.user');
  }

  getWatsonTtsPassword() {
    return _.get(this, 'watson.tts.password');
  }

  getWatsonSttUser() {
    return _.get(this, 'watson.stt.user');
  }

  getWatsonSttPassword() {
    return _.get(this, 'watson.stt.password');
  }

  update(config) {
    return _.merge(this, config);
  }
}

module.exports = Config;
