'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

const ConversationModel = require('../models/Conversation');
const ExchangeModel = require('../models/Exchange');

class Exchange {
  constructor(davis, user) {
    this.logger = davis.logger;

    this.user = user;
  }

  start(request, source) {
    ConversationModel.findOne({ userId: this.user.id })
      .then(res => {
        return (!_.isNull(res)) ? res : new ConversationModel({ userId: this.user.id });
      })
      .then(conversation => {
        
      })
    const exchange = new ExchangeModel({
      _conversation: conversation.id,
      source,
      request: {
        text: request,
      },
    });

    return exchange.save();
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

  finish() {
    // save
    return this;
  }
}

module.exports = Exchange;
