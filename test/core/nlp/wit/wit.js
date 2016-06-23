'use strict';

const Wit = require('../../../../app/core/nlp/wit'),
    chai = require('chai'),
    expect = chai.expect,
    user = require('../../../../app/config/user');

describe('Tests interacting with WIT', function() {
    it('should reject the request because a key wasn\'t provided', function(done) {
        try {
            new Wit();
            expect.fail('An error should have been thrown!');
        }
        catch(err) {
            done();
        }
    });

    const wit = new Wit(user.nlp.wit);

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