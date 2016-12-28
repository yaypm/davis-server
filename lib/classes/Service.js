'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const BbPromise = require('bluebird');
const rp = require('request-promise');
const AliasesModel = require('../models/Aliases');
const ProblemsModel = require('../models/Problems');

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
      .then((alias) => {
        _.assign(alias, { display: { audible, visual }, aliases });
        return alias.save();
      });
  }

  deleteAlias(aliasId, category) {
    return AliasesModel.remove({ _id: aliasId, category });
  }

  saveProblem(problem) {
    if (problem.ProblemID === 'TESTID') {
      this.logger.info('Received a custom integration test connection');
      return BbPromise.resolve();
    }
    return BbPromise.try(() => {
      // We need to convert the tags list into an array.
      if (problem.Tags) {
        problem.Tags = problem.Tags.replace(/ /g, '').split(',');
      }
    })
      .then(() => ProblemsModel.findOneAndUpdate(
        { PID: problem.PID },
        {
          PID: problem.PID,
          ProblemID: problem.ProblemID,
          State: problem.State,
          ProblemImpact: problem.ProblemImpact,
          ProblemURL: problem.ProblemURL,
          ImpactedEntity: problem.ImpactedEntity,
          Tags: problem.Tags,
        },
        { upsert: true, setDefaultsOnInsert: true }
      )
      )
      .then(() => {
        this.logger.debug(`Problem ${problem.PID} successfully saved to db.`);
        // Emitting the event after Mongoose validates its validity.
        this.event.emit(`${EVENT_PROBLEM}.${problem.State.toLowerCase()}`, problem);
        return null;
      });
  }

  /*
  * Watson
  */
  getTtsToken() {
    const options = {
      qs: {
        url: 'https://stream.watsonplatform.net/text-to-speech/api',
      },
      auth: {
        user: this.config.getWatsonTtsUser(),
        pass: this.config.getWatsonTtsPassword(),
        sendImmediately: true,
      },
    };

    return this.getWatsonToken(options);
  }

  getSttToken() {
    const options = {
      qs: {
        url: 'https://stream.watsonplatform.net/speech-to-text/api',
      },
      auth: {
        user: this.config.getWatsonSttUser(),
        pass: this.config.getWatsonSttPassword(),
        sendImmediately: true,
      },
    };

    return this.getWatsonToken(options);
  }

  getWatsonToken(options) {
    return BbPromise.try(() => {
      if (!this.config.isWatsonEnabled()) throw new this.davis.classes.Error('The Watson integration is disabled!');
      _.merge(options, {
        uri: 'https://stream.watsonplatform.net/authorization/api/v1/token',
        gzip: true,
        transform: (body, response) => {
          // Adds response time information to logs
          const path = response.req.path.split('?')[0];
          this.logger.info(`WATSON: ${path} ${response.statusCode} - ${response.elapsedTime} ms`);
          return body;
        },
        time: true,
      });
    })
      .then(() => rp(options))
      .catch((err) => {
        if (err.statusCode === 401) {
          throw new this.davis.classes.Error('Invalid Watson User ID or Password!');
        } else if (err.statusCode === 403) {
          throw new this.davis.classes.Error('Invalid Watson URL parameter!');
        } else if (err.name === 'DavisError') {
          throw err;
        } else {
          this.logger.error(`Watson responded with an unhandled status code of ${err.statusCode}.`);
          throw new this.davis.classes.Error('Unfortunately, there was an issue communicating with the Watson authentication service.');
        }
      });
  }

  update(data) {
    return _.merge(this, data);
  }
}

module.exports = Service;
