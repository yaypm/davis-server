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
          const configModel = new ConfigModel({
            dynatrace: {
              url: _.get(this, 'userDefinedConfig.dynatrace.url', process.env.DYNATRACE_URL) || '',
              apiUrl: _.get(this, 'userDefinedConfig.dynatrace.apiUrl', process.env.DYNATRACE_API_URL) || '',
              token: _.get(this, 'userDefinedConfig.dynatrace.token', process.env.DYNATRACE_TOKEN) || '',
              strict: _.get(this, 'userDefinedConfig.dynatrace.apiUrl', process.env.DYNATRACE_STRICT) || '',
            },
            slack: {
              enabled: _.get(this, 'userDefinedConfig.slack.enabled', process.env.SLACK_ENABLED) || '',
              clientId: _.get(this, 'userDefinedConfig.slack.clientId', process.env.SLACK_CLIENT_ID) || '',
              clientSecret: _.get(this, 'userDefinedConfig.slack.clientSecret', process.env.SLACK_CLIENT_SECRET) || '',
              redirectUri: _.get(this, 'userDefinedConfig.slack.redirectUri', process.env.SLACK_REDIRECT_URI) || '',
            },
          });
          return configModel.save();
        }
        return config;
      });
  }

  getConfiguration() {
    return this.load()
      .then(config => _.omit(config.model.toObject(), ['_id', '__v', 'jwtToken']));
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

  getDynatraceApiUrl() {
    if (this.model.dynatrace.apiUrl === '') {
      return this.getDynatraceUrl();
    }
    return this.model.dynatrace.apiUrl;
  }

  getDynatraceToken() {
    return this.model.dynatrace.token;
  }

  getDynatraceValidateCert() {
    return this.model.dynatrace.strictSSL;
  }

  isWatsonEnabled() {
    return this.model.watson.enabled;
  }

  getWatsonTtsUser() {
    return this.model.watson.tts.user;
  }

  getWatsonTtsPassword() {
    return this.model.watson.tts.password;
  }

  getWatsonSttUser() {
    return this.model.watson.stt.user;
  }

  getWatsonSttPassword() {
    return this.model.watson.stt.password;
  }

  isSlackEnabled() {
    return this.model.slack.enabled;
  }

  getSlackClientId() {
    return this.model.slack.clientId;
  }

  getSlackClientSecret() {
    return this.model.slack.clientSecret;
  }

  getSlackRedirectUri() {
    return this.model.slack.redirectUri;
  }

  getApiEventsToken() {
    return this.model.api.events;
  }
}

module.exports = Config;
