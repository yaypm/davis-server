'use strict';

require('../../../setup');
const problem = require('../../../../app/core/response-engine/intents/problem'),
    chai = require('chai'),
    expect = chai.expect;

describe('Test the problem intent', function() {
    let davis = {
        user: {
            id: 'test',
            name: {
                first: 'Michael',
                Last: 'Beemer'
            },
            alexa: ['amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA'],
            timezone: 'America/Detroit',
            dynatrace: {
                token: 'yIEa7xY_QJCFHKzYzIiHb',
                url: 'https://ruxitdev.dev.dynatracelabs.com'
            },
            nlp: {
                wit: 'QSB5XEEJJVIBDV3AJPLSZ7RFQGARQWQ5'
            }
        },
        conversation: {
            id: 1234,
            userId: 'test',
            startTime: new Date('2016-06-11T20:04:50.012Z'),
            lastInteraction: () => {
                return [{updatedAt: new Date()}, {updatedAt: new Date()}]
            }
        },
        exchange: {
            _conversation: 1234,
            source: 'alexa',
            authenticated: true,
            startTime: new Date('2016-06-07T10:05:50.012Z'),
            endTime: null,
            request: {
                text: 'What happened yesterday around 10pm?',
                analysed: {
                    intent: 'problem',
                    timeRange: null
                }
            },
            template: {
                path: []
            },
            response: {
                say: {
                    ssml: null
                },
                reprompt: null,
                show: {
                    html: null,
                    text: null
                },
                finished: false
            }
        },
        config: {
            aliases: {}
        },
        intentData: {
            problem: {
                result: {
                    problems: [{
                        id: '8656194286718040178',
                        startTime: 1465974600000,
                        endTime: -1,
                        displayName: '178',
                        impactLevel: 'SERVICE',
                        status: 'OPEN',
                        rankedImpacts: [
                            {
                                entityId: 'PROCESS_GROUP_INSTANCE-2DD74C27E8D9BD10',
                                entityName: 'ruxit-dev-us-east-CF',
                                impactLevel: 'INFRASTRUCTURE',
                                eventType: 'PGI_OF_SERVICE_UNAVAILABLE'
                            },
                            {
                                entityId: 'SERVICE-30F0B00E7B2DF49A',
                                entityName: 'easyTravel Customer Frontend',
                                impactLevel: 'SERVICE',
                                eventType: 'SERVICE_RESPONSE_TIME_DEGRADED'
                            },
                            {
                                entityId: 'SERVICE-30F0B00E7B2DF49A',
                                entityName: 'easyTravel Customer Frontend',
                                impactLevel: 'SERVICE',
                                eventType: 'SERVICE_RESPONSE_TIME_DEGRADED'
                            }
                        ],
                        affectedCounts: {
                            INFRASTRUCTURE: 0,
                            SERVICE: 2,
                            APPLICATION: 0
                        },
                        recoveredCounts: {
                            INFRASTRUCTURE: 3,
                            SERVICE: 2,
                            APPLICATION: 0
                        },
                        hasRootCause: true
                    }]
                }
            }
        }

    };

    it('should find single problem template', function(done) {
        problem.process(davis)
            .then(response => {
                console.log(response);
                done()
            })
            .catch(err => {
                done(err);
            })
    });
});