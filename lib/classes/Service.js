'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const BbPromise = require('bluebird');
const watson = require('watson-developer-cloud');
const vcapServices = require('vcap_services');
const AliasesModel = require('../models/Aliases');
const ProblemsModel = require('../models/Problems');

const WATSON_API_VERSION = 'v1';
const WATSON_STREAM_API_URL = 'https://stream.watsonplatform.net';

// class wide events
const EVENT_PROBLEM = 'davis.event.problem';

class Service {
  constructor(davis, data) {
    this.davis = davis;
    this.logger = davis.logger;
    this.config = davis.config;
    this.event = davis.event;

    if (data) this.update(data);
  }

  /*
  * MongoDB
  */
  connectToMongoDB() {
    this.logger.debug('Connecting to MongoDB');
    return BbPromise.resolve()
      .then(() => mongoose.connect(this.config.getMongoDBConnectionString()))
      .then(() => this.logger.debug('MongoDB Connected'));
  }

  isConnectedToMongoDB() {
    return mongoose.connection.readyState === 1;
  }

  /*
  * Dynatrace
  */
  getAllAliases() {
    return BbPromise.resolve()
      .then(() => BbPromise.all([
        this.getAliasesByCategory('applications'),
        this.getAliasesByCategory('services'),
        this.getAliasesByCategory('infrastructure'),
      ]))
      .spread((applications, services, infrastructure) => { // eslint-disable-line
        return { applications, services, infrastructure };
      });
  }

  getAliasesByCategory(category) {
    return AliasesModel.find({ category }).exec();
  }

  createAlias(name, category, audible, visual, aliases) {
    const newAlias = new AliasesModel({ name, category, display: { audible, visual }, aliases });
    return newAlias.save();
  }

  updateAlias(aliasId, audible, visual, aliases) {
    AliasesModel.findById({ _id: aliasId })
      .then(alias => {
        _.assign(alias, { display: { audible, visual }, aliases });
        return alias.save();
      });
  }

  deleteAlias(aliasId, category) {
    return AliasesModel.remove({ _id: aliasId, category });
  }

 /* eslint-disable no-param-reassign */
  saveProblem(problem) {
    return new BbPromise((resolve, reject) => {
      // TESTID is what Dynatrace sends when initially testing the endpoint.
      if (problem.ProblemID === 'TESTID') {
        this.logger.info('Received a custom integration test connection');
        resolve();
      } else {
        ProblemsModel.findOne({ PID: problem.PID })
          .then(res => {
            let promise;
            if (!_.isNull(res)) {
              if (res.State === problem.State) {
                throw new this.davis.classes.Error('A problem with that ID already exists.');
              }
              this.logger.debug('Updating problem');
              res.State = problem.State;
              res.ProblemImpact = problem.ProblemImpact;
              res.ImpactedEntity = problem.ImpactedEntity;
              res.Tags = problem.Tags.replace(/ /g, '').split(',');
              promise = res.save();
            } else {
              this.logger.debug('Saving a new problem');
              const problems = new ProblemsModel(problem);
              promise = problems.save();
            }
            return promise;
          })
          .then(() => {
            this.logger.debug(`Problem ${problem.PID} successfully saved to db.`);
            // Emitting the event after Mongoose validates its validity.
            this.event.emit(`${EVENT_PROBLEM}.${problem.State.toLowerCase()}`, problem);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }
  /* eslint-enable no-param-reassign */

  /*
  * Watson
  */
  getTtsToken() {
    return new BbPromise((resolve, reject) => {
      if (this.config.isWatsonEnabled()) {
        // Builds the Watson TTS config object
        const ttsConfig = _.assign({
          version: WATSON_API_VERSION,
          url: `${WATSON_STREAM_API_URL}/text-to-speech/api`,
          username: this.config.getWatsonTtsUser(),
          password: this.config.getWatsonTtsPassword(),
        }, vcapServices.getCredentials('text_to_speech'));

        const ttsAuthService = watson.authorization(ttsConfig);

        ttsAuthService.getToken({ url: ttsConfig.url }, (err, token) => {
          if (err) return reject(err);
          return resolve(token);
        });
      } else {
        reject(new this.davis.classes.Error('Watson TTS service is disabled!'));
      }
    });
  }

  getSttToken() {
    return new BbPromise((resolve, reject) => {
      if (this.config.isWatsonEnabled()) {
        // Builds the Watson STT config object
        const sttConfig = _.assign({
          version: WATSON_API_VERSION,
          url: `${WATSON_STREAM_API_URL}/speech-to-text/api`,
          username: this.config.getWatsonSttUser(),
          password: this.config.getWatsonSttPassword(),
        }, vcapServices.getCredentials('speech_to_text'));

        const sttAuthService = watson.authorization(sttConfig);

        sttAuthService.getToken({ url: sttConfig.url }, (err, token) => {
          if (err) return reject(err);
          return resolve(token);
        });
      } else {
        reject(new this.davis.classes.Error('Watson STT service is disabled!'));
      }
    });
  }

  update(data) {
    return _.merge(this, data);
  }
}

module.exports = Service;
