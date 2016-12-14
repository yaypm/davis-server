'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);
