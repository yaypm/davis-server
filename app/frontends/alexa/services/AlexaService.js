'use strict';

const ConversationService = require('../../../services/ConversationService'),
    AccountService = require('../../../services/AccountService'),
    _ = require('lodash');

var REQUEST_SOURCE = 'alexa';

module.exports.processRequest = function processRequest(request, cb) {
    var user = AccountService.getUser(_.get(request, 'session.user.userId', null), REQUEST_SOURCE);
    //ToDo handle non-authorized requests
    ConversationService.initiateConversation(user.name, function(err, conversation) {
        console.log('Loading a conversation');
        if(err) throw err;
        ConversationService.createExchange(conversation._id, REQUEST_SOURCE, function(err, exchange) {
            console.log('Creating a new exchange');
            if(err) throw err;
            cb(null, exchange);
        });
    });
};