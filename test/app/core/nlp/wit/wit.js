'use strict';

const Wit = require('../../../../../app/core/nlp/wit'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests interacting with WIT', function() {
    let wit,
        wit_token;

    before(function() {
        if (process.env.WIT_TOKEN) {
            wit_token = process.env.WIT_TOKEN;
        } else {
            console.log('skipping the WIT.AI tests because a token wasn\'t found');
            this.skip();
        }
    });

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
        wit = new Wit(wit_token);
        expect(wit).to.not.be.null;
    });

    it('should be a problem intent', function(done) {
        wit.ask('Did anything happen with Easy Travel yesterday around 10pm?', {timezone: 'America/Detroit'})
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