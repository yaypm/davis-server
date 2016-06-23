'use strict';

const ResponseEngine = require('../../../app/core/response-engine'),
    chai = require('chai'),
    expect = chai.expect,
    user = require('../../../app/config/user'),
    conversation = require('../../../app/config/conversation'),
    exchange = require('../../../app/config/exchange');

describe('Tests the response engine', function() {
    exchange.startTime = new Date();
    const responseEngine = new ResponseEngine({user, conversation, exchange});

    it('should not fail', function(done) {
        responseEngine.generate()
        .then(response => {
            // ToDo validate the times are accurate with the supplied timezone
            //console.log(`This is the start time ${response.request.processed.timeRange.startTime}`);
            //console.log(`This is the end time ${response.request.processed.timeRange.stopTime}`);
            //expect(response.request.processed.intent).to.equal('problem');
            done();
        })
        .catch(err => {
            done(err);
        });
    });
});