var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var exchange = new Schema({
    _account: { type: ObjectId, required: false, unique: false, index: false, ref: 'Account' },
    _conversation: { type: ObjectId, required: false, unique: false, index: false, ref: 'Conversation' },
    source: { type: String, required: true, unique: false, index: true},
    authenticated: { type: Boolean, required: true, unique: false, index: false, default: false },
    startTime: { type: Date, default: Date.now, required: true, unique: false, index: true },
    endTime: { type: Date, required: false, unique: false, index: true },
    intent: { type: String, required: false, unique: false, index: true},
    request: {},
    response: {}
}, {
    timestamps: true
});

exchange.set('autoIndex', false);
module.exports = mongoose.model('Exchange', exchange);