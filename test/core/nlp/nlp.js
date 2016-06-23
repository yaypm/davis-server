'use strict';

const Nlp = require('../../../app/core/nlp'),
    chai = require('chai'),
    expect = chai.expect,
    user = require('../../../app/config/user'),
    conversation = require('../../../app/config/conversation'),
    exchange = require('../../../app/config/exchange');

describe('Tests interacting with the davis NLP wrapper', function() {
    const nlp = new Nlp({user, conversation, exchange});

    it('should be a problem intent', function(done) {
        nlp.process()
        .then(response => {
            // ToDo validate the times are accurate with the supplied timezone
            //console.log(`This is the start time ${response.request.processed.timeRange.startTime}`);
            //console.log(`This is the end time ${response.request.processed.timeRange.stopTime}`);
            expect(response.request.analysed.intent).to.equal('problem');
            done();
        })
        .catch(err => {
            done(err);
        });
    });
});