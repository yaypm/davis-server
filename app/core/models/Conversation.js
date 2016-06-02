var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var conversation = new Schema({
    userId: { type: String, required: true, unique: true, index: true },
    startTime: { type: Date, default: Date.now, required: true, unique: false, index: true },
    metadata: {}
}, {
    timestamps: true
});

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);