'use strict';

require('../../../setup.js');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    AlexaService = require('../../../../app/intergrations/alexa/services/AlexaService'),
    alexaRequests = require('../../../fixtures/alexa');


describe('The Alexa frontend service', function() {

    /*it('should start a new conversation and exchange', function(done) {
        AlexaService.processRequest(alexaRequests.requests.launch, function(err, res){
            console.log(JSON.stringify(res));
            done();
        });
    });*/

    /*
    it('should not find a user and return null', function() {
        let user = AlexaService.getUser({session: {user: { userId: 'this-user-shouldnt-exist' }}});
        expect(user).to.be.null;
    });

    it('should find a user', function() {
        let user = AlexaService.getUser({session: {user: { userId: 'amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA' }}});
        expect(user.id).to.equal('beeme1mr');
    });
    */
});