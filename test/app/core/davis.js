'use strict';

require('../../setup.js');
const chai = require('chai'),
    expect = chai.expect,
    Davis = require('../../../app/core'),
    AccountService = require('../../../app/services/AccountService'),
    ConversationService = require('../../../app/services/ConversationService');

const DEVICE_ID = 'amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA',
    SOURCE = 'alexa';

describe.skip('Test the Davis core', function () {
    it('should generate a response for a question about problems', function (done) {

        this.timeout(15000);
        let user = AccountService.getUser(DEVICE_ID, SOURCE);

        ConversationService.getConversation(user)
            .then(conversation => {
                expect(conversation.userId).to.equal(user.id);
                let davis = new Davis(user, conversation);
                return davis.interact('What happened yesterday around 10pm?', SOURCE);
            })
            .then(() => {
                //expect results
                console.log('We finished!');
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});