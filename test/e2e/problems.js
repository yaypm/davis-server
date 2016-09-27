'use strict';

require('../setup.js');

const chai = require('chai'),
    expect = chai.expect,
    ConversationService = require('../../app/services/ConversationService'),
    config = require('../mock_data/davis/config'),
    Davis = require('../../app/core/index');

const SOURCE = 'TEST';

config.user = {
    id: 'mochatestuser',
    timezone: 'America/Detroit',
    lang: 'en-us',
    dynatrace: {
        token: process.env.DYNATRACE_TOKEN,
        url: process.env.DYNATRACE_URL,
        // Optional - Set to false when using self signed certs
        strictSSL: true
    },
    nlp: {
        wit: process.env.WIT_TOKEN
    }
};

let davis;

describe('An end to end conversation about problems', function () {

    this.timeout(5000);

    before(function() {
        if (!process.env.DYNATRACE_URL) {
            console.log('skipping because the dyantrace url wasn\'t found');
            this.skip();
        }
        if (!process.env.DYNATRACE_TOKEN) {
            console.log('skipping because the dynatrace api token wasn\'t found');
            this.skip();
        }
        if (!process.env.WIT_TOKEN) {
            console.log('skipping the WIT.AI tests because a token wasn\'t found');
            this.skip();
        }
    });

    it('It should start our conversation', function (done) {
        ConversationService.getConversation(config.user)
            .then(conversation => {
                davis = new Davis(config.user, conversation, config);
                return davis.interact('start', SOURCE);
            })
            .then(davis => {
                expect(davis.exchange.request.analysed.intent).to.equal('launch');
                expect(davis.exchange.response.finished).to.be.false;
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('It should return a problem intent', function (done) {
        davis.interact('what happened yesterday?', SOURCE)
            .then(davis => {
                expect(davis.exchange.request.analysed.intent).to.equal('problem');
                expect(davis.exchange.response.finished).to.be.false;
                done();
            })
            .catch(err => {
                done(err);
            });
    });


    it('It should end the conversation', function (done) {
        davis.interact('thanks, that\'s it', SOURCE)
            .then(davis => {
                expect(davis.exchange.request.analysed.intent).to.equal('stop');
                expect(davis.exchange.response.finished).to.be.true;
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});