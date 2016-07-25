'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ExchangeModel = require('./Exchange');

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const conversation = new Schema({
    userId: { type: String, required: true, unique: true, index: true },
    metadata: {}
}, {
    createdAt: 'startTime',
    updatedAt: 'lastInteraction'
});

conversation.methods.getHistory = function getHistory(length, cb) {
    return ExchangeModel.find({_conversation: this.id}).limit(length).sort({'updatedAt': -1}).exec(cb);
};

conversation.methods.lastInteraction = function lastInteraction(cb) {
    return ExchangeModel.find({_conversation: this.id}).limit(2).sort({'updatedAt': -1}).select('updatedAt').exec(cb);
};

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);