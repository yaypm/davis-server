require('../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;

var ConversationService = require('../../app/services/ConversationService');



describe('The ConversationService', function(done) {

    it('should create a new conversation if none exists for this user', function(done) {

        ConversationService.initiateConversation('test1', function(err, conversation) {

            if (err) throw err;

            expect(conversation).to.be.not.null;
            expect(conversation.userId).to.equal('test1');

            var conversationId = conversation.id;

            ConversationService.initiateConversation('test1', function(err, conversation) {
                if (err) throw err;

                expect(conversation).to.be.not.null;
                expect(conversation.userId).to.equal('test1');

                expect(conversation.id).to.equal(conversationId);


                ConversationService.initiateConversation('test2', function(err, conversation) {

                    expect(conversation).to.be.not.null;
                    expect(conversation.userId).to.equal('test2');

                    expect(conversation.id).to.not.equal(conversationId);

                    return done();

                });



            });



        });

    });


});