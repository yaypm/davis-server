'use strict';

const ConversationModel = require('../core/models/Conversation'),
    ExchangeModel = require('../core/models/Exchange'),
    _ = require('lodash'),
    logger = require('../utils/logger'),
    BbPromise = require('bluebird');

const ConversationService = {
    /**
     * Gets or starts a conversation
     * @param {object} user - The user making the request
     * @returns {promise} resolves to a conversation object
     */
    getConversation: (user) => {
        logger.info('Loading a conversation');
        return new BbPromise((resolve, reject) => {
            
            ConversationModel.findOne({userId: user.id})
            .then( res => {
                // We found an existing conversation;
                if (!_.isNull(res)) return resolve(res);

                let conversation = new ConversationModel({userId: user.id});

                conversation.save()
                .then(() => {
                    return resolve(conversation);
                })
                .catch(err => {
                    return reject(err);
                });
            })
            .catch( err => {
                logger.error(`Unable to load or create a conversation for ${user.id}.`);
                reject(err);
            });
        });
    },

    /**
     * Starts a new exchange
     * @param {object} conversation - The conversation object associated with the user
     * @param {string} request - The request the user made to Davis
     * @param {string} source - The source of the request
     * @returns {promise} resolves to an exchange object
     */
    startExchange: (conversation, request, source) => {
        logger.info('source: '+JSON.stringify(source));
        logger.info('request: '+JSON.stringify(request));

        logger.info('Starting a new exchange');
        return new BbPromise((resolve, reject) => {
            let exchange = new ExchangeModel({
                _conversation: conversation._id,
                source: source,
                request: {
                    text: request
                }
            });
            
            exchange.save()
                .then(() => {
                    return resolve(exchange);
                })
                .catch( err => {
                    return reject(err);
                });
        });
    }
};

module.exports = ConversationService;