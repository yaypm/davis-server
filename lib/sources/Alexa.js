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
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
  }

  askDavis(req) {
    const exchange = new Exchange(this.davis);
    return BbPromise.bind(this)
      .exchange.validateUser()
      .then(() => exchange.start(this.getRawRequest(req), ALEXA_REQUEST_SOURCE))
      .then(() => )
  }

  validateUser(user) {
    return true;
  }

  getRawRequest(req) {
    const requestType = _.get(req, 'request.type');
    let phrase;
    if (requestType === 'LaunchRequest') {
      phrase = LAUNCH_PHRASE;
    } else if (requestType === 'IntentRequest') {
      phrase = _.get(req, 'request.intent.slots.command.value');
    } else if (requestType === 'SessionEndedRequest') {
      const reasonForError = _.get(req, 'request.reason', 'of an unknown reason');
      this.logger.debug(`The session is ending because ${reasonForError}.`);
    } else {
      throw new DError(`Received an unknown request type: ${requestType}`);
    }
    return phrase;
  }

  formatReponse(reponse, endSession) {
    return {
      version: RESPONSE_VERSION,
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
