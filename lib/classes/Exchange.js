'use strict';

const DError = require('./Error').DError;
const BbPromise = require('bluebird');
const _ = require('lodash');

const ConversationModel = require('../models/Conversation');
const ExchangeModel = require('../models/Exchange');

class Exchange {
  /**
   * Creates an instance of Exchange.
   *
   * @param {Object} davis
   * @param {Object} user
   * @param {string} user.id - A unique ID for the user.
   * @param {string} user.email - The email address of the user.
   * @param {string} user.name.first - The first name of the user.
   * @param {string} user.name.last - The last name of the user.
   * @param {string} user.timezone - The canonical timezone of the user.
   *
   * @memberOf Exchange
   */
  constructor(davis, user) {
    this.logger = davis.logger;

    this.user = user;

    this.davis = davis;
  }

  /**
   * Starts a new exchange
   *
   * @param {string} request - The request from the user.
   * @param {string} source - The source of the user request.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  start(request, source) {
    return BbPromise.try(() => {
      if (!request) throw new DError('A user request is required!');
      if (!source) throw new DError('A source is required!');
    }).bind(this)
      .then(() => ConversationModel.findOne({ userId: this.user.id }))
      .then(this.getConversation)
      .then(this.getConversationHistory)
      .then(conversation => {
        this.exchange = new ExchangeModel({
          _conversation: conversation.id,
          source,
          request: {
            raw: request.trim(),
          },
        });
        return this;
      });
  }

  /**
   * Saves the current exchange to MongoDB
   *
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  save() {
    // return this.exchange.save();
    return BbPromise.resolve()
      .then(() => this.exchange.save())
      .then(() => this);
  }

  /**
   * Creates or reuses a conversation
   *
   * @param {Object} conversation - The conversation object from MongoDB.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  getConversation(conversation) {
    return BbPromise.resolve()
      .then(() => {
        if (_.isNull(conversation)) {
          this.logger.info('We\'re never talked to this user before.  Starting a new conversation');
          const conversationModel = new ConversationModel({ userId: this.user.id });
          return conversationModel.save();
        }
        return conversation;
      });
  }

  /**
   * Gathers the users history based on prior exchanges
   *
   * @param {Object} conversation - The conversation object from MongoDB.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  getConversationHistory(conversation) {
    return BbPromise.resolve().bind(this)
      .then(() => ExchangeModel
        .find({ _conversation: conversation.id })
        .limit(10)
        .sort({ updatedAt: -1 })
        .exec())
      .then(history => {
        this.history = {
          firstInteraction: (history.length === 0),
        };
        return conversation;
      });
  }

  isFirstInteraction() {
    return this.history.firstInteraction;
  }

  say(text) {
    this.response.visual.text = text;
  }

  show(card) {
    this.response.visual.card = card;
  }

  getRaw() {
    return this.request.raw;
  }

  getTimezone() {
    return this.user.timezone;
  }

  finish() {
    // save
    return this;
  }
}

module.exports = Exchange;
