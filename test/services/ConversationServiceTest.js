'use strict';

require('../setup.js');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    ConversationService = require('../../app/services/ConversationService');

describe('The ConversationService', function() {

    it('should create a new conversation', function(done) {
        ConversationService.getConversation({id: 'beeme1mr'})
        .then(conversation => {
            expect(conversation.userId).to.equal('beeme1mr');
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('should find the existing conversation and start an exchange', function(done) {
        ConversationService.getConversation({id: 'beeme1mr'})
        .then(conversation => {
            expect(conversation.userId).to.equal('beeme1mr');
            return [ConversationService.startExchange(conversation, 'alexa'), conversation];
        })
        .spread((exchange, conversation) => {
            expect(exchange._conversation).to.equal(conversation._id);
            done();
        })
        .catch(err => {
            done(err);
        });
    });
});