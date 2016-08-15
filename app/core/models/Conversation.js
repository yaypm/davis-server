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

conversation.methods.getHistory = function getHistory(length) {
    return ExchangeModel.find({_conversation: this.id}).limit(length).sort({'updatedAt': -1}).exec();
};

conversation.methods.lastInteraction = function lastInteraction() {
    return ExchangeModel.find({_conversation: this.id}).limit(2).sort({'updatedAt': -1}).select('updatedAt').exec();
};

conversation.methods.lastMultipleChoiceData = function lastMultipleChoiceData() {
    return ExchangeModel.find({_conversation: this.id, 'state.next.multipleChoice': { $exists: true }}).limit(1).sort({'updatedAt': -1}).exec();
}

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);