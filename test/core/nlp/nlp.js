'use strict';

require('../../setup.js');
const Nlp = require('../../../app/core/nlp'),
    chai = require('chai'),
    expect = chai.expect,
    AccountService = require('../../../app/services/AccountService'),
    ConversationService = require('../../../app/services/ConversationService');

describe('Tests interacting with the davis NLP wrapper', function() {
    it('should successfully create a new NLP object', function(done) {
        let user = AccountService.getUser('amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA', 'alexa');
        
        ConversationService.getConversation(user)
        .then(conversation => {
            expect(conversation.userId).to.equal(user.id);
            return [ConversationService.startExchange(conversation, 'hello', 'alexa'), conversation];
        })
        .spread((exchange, conversation) => {
            expect(exchange._conversation).to.equal(conversation._id);
            exchange.request = {
                text: 'What happened yesterday around 10pm?'
            };

            let nlp = new Nlp({user, exchange, conversation});
            return nlp.process();
        })
        .then(response => {
            expect(response.request.analysed.intent).to.equal('problem');
            done();
        })
        .catch(err => {

            console.log(err);

            done(err);
        });
    });
});