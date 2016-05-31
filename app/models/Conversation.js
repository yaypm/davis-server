var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var conversation = new Schema({
    userId: { type: String, required: true, unique: false, index: false },
    startTime: { type: Date, default: Date.now, required: true, unique: false, index: true },
    metadata: {}
}, {
    timestamps: true
});

conversation.set('autoIndex', false);
module.exports = mongoose.model('Conversation', conversation);