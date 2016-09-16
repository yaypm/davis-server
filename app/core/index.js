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

            conversationService.startExchange(this.conversation, request.trim(), source)
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
                    // // Temporary for testing isChromeExtensionConnected functionality. Not working at the moment
                    // if (source == 'alexa' && this.exchange.response.visual.text.includes(' Would you like me to open this for you?')) {
                    //     const express =  require('../index');
                    //     express.isChromeExtensionConnected(this.user.id).then( isConnected => {
                    //         if (!isConnected) {
                    //             logger.debug('Chrome extension not connected, URL was not sent');
                    //             this.exchange.response.visual.text = this.exchange.response.visual.text.replace(' Would you like me to open this for you?', '');
                    //             this.exchange.response.finished = 'true';
                    //         }
                    //         resolve(this);
                    //     })
                    //     .catch(err => {
                    //         logger.error(err.message);
                    //         reject(err);
                    //     });
                       
                    // } else {
                        resolve(this);
                    // }
                })
                .catch(err => {
                    logger.error(err.message);
                    reject(err);
                });
        });
    }

    /**
     * Processes requests for internal systems.
     * @param {string} intent - The intent that should be used to generate a response.
     * @param {Object} [data] - Additional data that the intent can use for response generation.
     * @returns {promise}
     */
    process(intent, data) {
        return new BbPromise((resolve, reject) => {

            conversationService.startExchange(this.conversation, intent, 'system')
                .then(exchange => {
                    this.exchange = exchange;

                    this.exchange.request = {
                        text: `Davis service running '${intent}`,
                        analysed: {
                            intent: intent
                        }
                    };
                    this.exchange.intent = [intent];
                    //Allows us to pass additional information directly to the intent handler.
                    if(data) this.data = data;
                    return responseEngine.generate(this);
                })
                .then(() => {
                    logger.debug('The response has been successfully generated');
                    return [this.exchange.save(),
                        this.conversation.save()];
                })
                .spread(() => {
                    logger.debug('Davis has finished processing the request');
                    resolve(this);
                })
                .catch(err => {
                    logger.error(err.message);
                    reject(err);
                });
        });
    }
}

module.exports = Davis;