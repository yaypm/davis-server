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
});