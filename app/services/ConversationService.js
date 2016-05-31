var ConversationModel = require("../models/Conversation");

module.exports.initiateConversation = function initiateConversation(userId, cb) {
    ConversationModel.findOne({
        userId: userId
    }, function(err, res) {

        if (err) return cb(err);

        if (res !== null) return cb(null, res);

        var conversation = new ConversationModel({
            userId: userId
        });
        
        conversation.save(function(err, res) {
            if (err) return cb(err);
            return cb(null, res);
        });

    });
};

module.exports.createExchange = function addExchange(conversationId) {
    
}