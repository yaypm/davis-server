'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ExchangeModel = require('./Exchange');

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

// Defines the conversation schema
const conversation = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  metadata: {},
}, {
  createdAt: 'startTime',
  updatedAt: 'lastInteraction',
});

conversation.methods.lastMultipleChoiceData = function lastMultipleChoiceData() {
  return ExchangeModel
    .find({ _conversation: this.id, 'state.next.multipleChoice': { $exists: true } })
    .limit(1).sort({ updatedAt: -1 })
    .exec();
};

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);
