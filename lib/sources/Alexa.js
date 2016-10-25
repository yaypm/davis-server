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
    this.Users = davis.classes.Users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
  }

  askDavis(req) {
    const users = new this.Users(this.davis);
    // const exchange = new Exchange(this.davis);
    return BbPromise.resolve().bind(this)
      .then(() => _.get(req, 'body.session.user.userId'))
      .then(users.validateAlexaUser)
      .then(() => this.formatReponse('test yo', true))
      .catch(err => this.formatReponse(err.message, true));
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
    } else {
      throw new DError(`Received an unknown request type ${requestType}!`);
    }
    return phrase;
  }

  formatReponse(response, endSession) {
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
