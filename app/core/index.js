'use strict';

const BbPromise = require('bluebird'),
    Nlp = require('./nlp'),
    _ = require('lodash'),
    conversationService = require('../services/ConversationService'),
    responseEngine = require('./response-engine'),
    logger = require('../utils/logger');

class Davis {
    /**
     * Davis Core
     * @constructs Davis
     * @param {object} user - The user making the request
     * @param {object} conversation - The conversation object that helps give context
     * @param {object} config - The config object
     */
    constructor(user, conversation, config) {
        this.user = user;
        this.conversation = conversation;
        this.config = config;
    }

    /**
     * Interacts with davis
     * @param {string} request - The input from the user
     * @param {string} [source=unknown] - The source of the request
     * @returns {promise}
     */
    interact(request, source) {
        //ToDo validate user
        if(_.isNil(source)) {
            logger.warn('Please consider adding a source.  This will help generate more relevant responses.');
            source = 'unknown';
        }
        return new BbPromise((resolve, reject) => {
            conversationService.startExchange(this.conversation, request, source)
                .then(exchange => {
                    logger.debug('The exchange object was successfully created');
                    this.exchange = exchange;

                    let nlp = new Nlp(this);
                    return nlp.process();
                })
                .then(() => {
                    logger.debug('The request has been analysed');
                    return responseEngine.generate(this);
                })
                .then(() => {
                    logger.debug('The response has been successfully generated');
                    return [this.exchange.save(),
                        this.conversation.save()];
                })
                .spread(() => {
                    logger.debug('Davis has finished processing the request');
                    return resolve(this);
                })
                .catch(err => {
                    logger.error(err.message);
                    return reject(err);
                });
        });
    }
}

module.exports = Davis;