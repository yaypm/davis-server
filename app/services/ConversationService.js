const ConversationModel = require('../core/models/Conversation'),
    ExchangeModel = require('../core/models/Exchange');

module.exports.initiateConversation = function initiateConversation(userId, cb) {
    ConversationModel.findOne({
        userId: userId
    }, function(err, res) {

        if (err) return cb(err);

        if (res !== null) return cb(null, res);

        var conversation = new ConversationModel({
            userId: userId
        });
        
        conversation.save(cb);
    });
};

module.exports.createExchange = function addExchange(conversationId, source, cb) {
    var exchange = new ExchangeModel({
        _conversation: conversationId,
        source: source
    });
    
    exchange.save(cb);
};