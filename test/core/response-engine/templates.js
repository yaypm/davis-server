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

    it('should dynamically load in the approperate templates', function(done) {
        //Setting a template path
        templateEngine.exchange.template.path = 'en-us/intents/problem/tense/past/many';
        templateEngine.buildResponse()
        .then(response => {
            expect(response.exchange.response.say.ssml).to.not.be.null;
            done();
        })
        .catch(err => {
            done(err);
        });
    });
});