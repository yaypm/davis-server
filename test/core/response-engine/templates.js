'use strict';

require('../../setup.js');
const TemplateEngine = require('../../../app/core/response-engine/templates'),
    chai = require('chai'),
    expect = chai.expect,
    user = require('../../../app/config/user'),
    conversation = require('../../mock_data/davis/conversation'),
    exchange = require('../../mock_data/davis/exchange');

describe('Tests the template engine', function() {
    const templateEngine = new TemplateEngine({user, conversation, exchange});

    it('should not fail', function(done) {
        //Setting a template path
        templateEngine.exchange.template.path = 'en-us/intents/problem/tense/past/many';
        templateEngine.buildResponse()
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