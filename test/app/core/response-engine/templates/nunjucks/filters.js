'use strict';

require('../../../../../setup');

const rewire = require('rewire'),
    filters = rewire('../../../../../../app/core/response-engine/response-builder/nunjucks/filters.js'),
    aliases = require('../../../../../mock_data/davis/aliases'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests the filters available in the response engine', function() {
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
});