'use strict';

const DError = require('../classes/Error').DError;
const _ = require('lodash');
const BbPromise = require('bluebird');

const ALEXA_RESPONSE_VERSION = '1.0';
const ALEXA_LAUNCH_PHRASE = 'Start davis';
const ALEXA_REQUEST_SOURCE = 'alexa';

class Alexa {
  constructor(davis) {
    this.logger = davis.logger;
    this.pluginManager = davis.pluginManager;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
  }

  askDavis(req) {
    return BbPromise.resolve()
      .then(() => _.get(req, 'body.session.user.userId'))
      .then(aid => this.users.validateAlexaUser(aid))
      .then(user => {
        const exchange = new this.Exchange(this.davis, user);
        return exchange.start(this.getRawRequest(req), ALEXA_REQUEST_SOURCE);
      })
      .then(exchange => this.pluginManager.run(exchange))
      .then(exchange => this.formatResponse(exchange))
      .catch(err => this.formatErrorResponse(err.message));
  }

  getRawRequest(req) {
    const requestType = _.get(req, 'body.request.type');
    let phrase;
    if (requestType === 'LaunchRequest') {
      phrase = ALEXA_LAUNCH_PHRASE;
    } else if (requestType === 'IntentRequest') {
      phrase = _.get(req, 'body.request.intent.slots.command.value');
    } else if (requestType === 'SessionEndedRequest') {
      const reasonForError = _.get(req, 'body.request.reason', 'of an unknown reason');
      this.logger.debug(`The session is ending because ${reasonForError}.`);
      throw new DError('End session received.');
    } else {
      throw new DError(`Received an unknown request type ${requestType}!`);
    }
    return phrase;
  }

  formatErrorResponse(message) {
    return this.alexaResponse(message, true);
  }

  formatResponse(exchange) {
    const response = exchange.getAudibleResponse();
    const endConversation = exchange.shouldConversationEnd();
    return this.alexaResponse(response, endConversation);
  }

  alexaResponse(response, endSession) {
    return {
      version: ALEXA_RESPONSE_VERSION,
      sessionAttributes: {},
      response: {
        shouldEndSession: endSession,
        outputSpeech: {
          type: 'SSML',
          ssml: `<speak>${response}</speak>`,
        },
      },
    };
  }
}

module.exports = Alexa;
