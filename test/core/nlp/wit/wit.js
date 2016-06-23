'use strict';

const Wit = require('../../../../app/core/nlp/wit'),
    chai = require('chai'),
    expect = chai.expect,
    AccountService = require('../../../../app/services/AccountService');

describe('Tests interacting with WIT', function() {
    let user = AccountService.getUser('amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA', 'alexa'),
        wit;

    it('should reject the request because a key wasn\'t provided', function(done) {
        try {
            new Wit();
            expect.fail('An error should have been thrown!');
        }
        catch(err) {
            done();
        }
    });

    it('should create a new WIT object', function() {
        wit = new Wit(user.nlp.wit);
        expect(wit).to.not.be.null;
    });

    it('should be a problem intent', function(done) {
        wit.ask('Did anything happen with Easy Travel yesterday around 10pm?', {timezone: user.timezone})
        .then( response => {
            expect(response.entities.intent[0].value).to.equal('problem');
            expect(response.entities.app_name[0].value).to.equal('Easy Travel');
            done();
        })
        .catch( err => {
            if(err) done(err);
        });
    });
});