const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const exchange = new Schema({
    _conversation: { type: ObjectId, required: false, unique: false, index: false, ref: 'Conversation' },
    source: { type: String, required: true, unique: false, index: true},
    startTime: { type: Date, default: Date.now, required: true, unique: false, index: true },
    endTime: { type: Date, required: false, unique: false, index: true },
    request: {
        text: { type: String, required: true, unique: false, index: false},
        analysed: {}
    },
    template: {},
    intent: [],
    state: {},
    response: {
        audible: {
            ssml: {type: String, required: false, unique: false, index: false, default: null}
        },
        reprompt: { type: String, required: false, unique: false, index: false},
        visual: {
            card: {type: Object, required: false, unique: false, index: false, default: null},
            hyperlink: {type: String, required: false, unique: false, index: false, default: null},
            text: {type: String, required: false, unique: false, index: false, default: null}
        },
        finished: { type: Boolean, required: false, unique: false, index: false, default: true}
    }
}, {
    timestamps: true
});

exchange.set('autoIndex', false);
module.exports = mongoose.model('Exchange', exchange);