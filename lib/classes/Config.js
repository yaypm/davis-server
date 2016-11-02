'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const path = require('path');

const ConfigModel = require('../models/Config');

class Config {
  constructor(davis, config) {
    this.logger = davis.logger;
    this.event = davis.event;
    this.davisPath = path.join(__dirname, '..');

    this.userDefinedConfig = _.merge({}, config);
    this.davis = davis;
  }

  load() {
    return BbPromise.resolve()
      .then(() => ConfigModel.findOne({}).exec())
      .then(config => this._getConfiguration(config))
      .then(config => {
        this.logger.debug('Successfully pulled the latest configuration from MongoDB.');
        this.model = config;
        return this;
      });
  }

  reload() {
    this.logger.debug('Reloading the configuration from MongoDB.');
    return this.load();
  }

  _getConfiguration(config) {
    return BbPromise.resolve()
      .then(() => {
        if (_.isNull(config)) {
          this.logger.info('No existing configuration data found!');
          const configModel = new ConfigModel({});
          return configModel.save();
        }
        return config;
      });
  }

  getConfiguration() {
    return this.load()
      .then(config => _.omit(config.model.toObject(), ['_id', '__v']));
  }

  updateConfig(config) {
    _.merge(this.model, config);
    return this.model.save()
      .then(() => this.reload());
  }

  getDavisPort() {
    return this.port || process.env.PORT || 3000;
  }

  getMongoDBConnectionString() {
    return process.env.MONGODB_URI || 'mongodb://localhost/davis';
  }

  getJwtToken() {
    return this.model.jwtToken;
  }

  getDynatraceUrl() {
    return this.model.dynatrace.url;
  }

  getDynatraceToken() {
    return this.model.dynatrace.token;
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
}

module.exports = Config;
