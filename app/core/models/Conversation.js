'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const conversation = new Schema({
    userId: { type: String, required: true, unique: true, index: true },
    startTime: { type: Date, default: Date.now, required: true, unique: false, index: true },
    metadata: {}
}, {
    timestamps: true
});

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);