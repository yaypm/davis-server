'use strict';

require('../../../../../setup');

const rewire = require('rewire'),
    filters = rewire('../../../../../../app/core/response-engine/response-builder/nunjucks/filters.js'),
    aliases = require('../../../../../mock_data/davis/aliases'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests the filters available in the response engine', function() {
    
    // friendlyEntityName
    describe('Tests the friendly entity builder', function() {
        let getFriendlyEntityName = filters.__get__('getFriendlyEntityName');
        it('should find and say nginx', function() {
            let entity = getFriendlyEntityName(aliases.aliases, 'services','nginx', 'audible');
            expect(entity).to.equal('Engine-X');
        });

        it('shouldnt find this server but still generate the best possible friendly name', function() {
            let entity = getFriendlyEntityName(aliases.aliases, 'services','  this_is-a_randomService', 'visual');
            expect(entity).to.equal('this is a random service');
        });
    });
    
    // friendlyTimeRange
    describe('Tests the friendly time range builder', function() {
        let getFriendlyTimeRange = filters.__get__('getFriendlyTimeRange');
        it('should generate MM/DD/YYYY time range in compact format', function() {
            let timeRange = {
                startTime: '2016-08-01T04:00:00.000Z', 
                stopTime: '2016-09-01T03:59:59.999Z'
            };
            let user = {
                timezone: 'America/New_York'
            };
            let str = getFriendlyTimeRange(timeRange, user, true);
            expect(str).to.equal('08/01/2016 at 12:00 AM - \\n08/31/2016 at 11:59 PM');
        });
        
        it('should generate MM/DD/YYYY time range in non-compact format', function() {
            let timeRange = {
                startTime: '2016-08-01T04:00:00.000Z', 
                stopTime: '2016-09-01T03:59:59.999Z'
            };
            let user = {
                timezone: 'America/New_York'
            };
            let str = getFriendlyTimeRange(timeRange, user, false);
            expect(str).to.equal('between 08/01/2016 at 12:00 AM and 08/31/2016 at 11:59 PM');
        });
        
        it('should generate MM/DD/YYYY time range in compact format with a +6 hour difference for Vienna timezone', function() {
            let timeRange = {
                startTime: '2016-08-01T04:00:00.000Z', 
                stopTime: '2016-09-01T03:59:59.999Z'
            };
            let user = {
                timezone: 'Europe/Vienna'
            };
            let str = getFriendlyTimeRange(timeRange, user, true);
            expect(str).to.equal('08/01/2016 at 6:00 AM - \\n09/01/2016 at 5:59 AM');
        });
    });
    
    // makeTitle
    describe('Tests the title-case string converter', function() {
        let makeTitle = filters.__get__('makeTitle');
        it('should have the first letter of each word capitalized, with the rest in their original case', function() {
            let str = makeTitle('the quick bROWN Fox jumps over the lazy doG');
            expect(str).to.equal('The Quick BROWN Fox Jumps Over The Lazy DoG');
        });
    });
    
    // capitalizeFirstCharacter
    describe('Tests the capitalization of the first character in a string', function() {
        let capitalizeFirstCharacter = filters.__get__('capitalizeFirstCharacter');
        it('should have the first letter of the string capitalized, with the rest in their original case', function() {
            let str = capitalizeFirstCharacter('the quick bROWN Fox jumps over the lazy doG');
            expect(str).to.equal('The quick bROWN Fox jumps over the lazy doG');
        });
    });
    
    // pluralizeNoun
    describe('Tests the pluralization of a string', function() {
        let pluralizeNoun = filters.__get__('pluralizeNoun');
        it('should return the plural of fox', function() {
            let str = pluralizeNoun('fox', 2);
            expect(str).to.equal('foxes');
        });
    });
    
    // buildProblemsUrl
    describe('Tests the building of problems url', function() {
        let buildProblemsUrl = filters.__get__('buildProblemsUrl');
        it('should add the #problems page to end of tenant url', function() {
            let problems = [];
            let user = {
                dynatrace: {
                    url: 'https://demo.live.dynatrace.com'
                }
            }
            let str = buildProblemsUrl(problems, user);
            expect(str).to.equal('https://demo.live.dynatrace.com/#problems');
        });
    });
    
    // buildProblemUrl
    describe('Tests the building of a problem url', function() {
        let buildProblemUrl = filters.__get__('buildProblemUrl');
        it('should have the problem id in the tenant url', function() {
            let problem = {
                id: '-2968663214739407461'
            }
            let user = {
                dynatrace: {
                    url: 'https://demo.live.dynatrace.com'
                }
            }
            let str = buildProblemUrl(problem, user);
            expect(str).to.equal('https://demo.live.dynatrace.com/#problems;filter=watched/problemdetails;pid=-2968663214739407461');
        });
    });
    
     // buildEventUrl
    describe('Tests the building of an event url', function() {
        let buildEventUrl = filters.__get__('buildEventUrl');
        it('should have the event entityId in the tenant url', function() {
            let event = {
                entityId: 'PROCESS_GROUP_INSTANCE-3ABDB501EFC8C4A4'
            }
            let user = {
                dynatrace: {
                    url: 'https://demo.live.dynatrace.com'
                }
            }
            let str = buildEventUrl(event, user);
            expect(str).to.equal('https://demo.live.dynatrace.com/#processdetails;id=PROCESS_GROUP_INSTANCE-3ABDB501EFC8C4A4');
        });
    });
});