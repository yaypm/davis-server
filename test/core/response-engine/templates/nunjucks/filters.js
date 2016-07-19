'use strict';

require('../../../../setup');

const nunjucks = require('../../../../../app/core/response-engine/templates/nunjucks'),
    rewire = require('rewire'),
    filters = rewire('../../../../../app/core/response-engine/templates/nunjucks/filters.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests the filters available in the response engine', function() {
    describe('Tests the friendly entity builder', function() {
        let getFriendlyEntityName = filters.__get__('getFriendlyEntityName');
        it('should find and say nginx', function() {
            let entity = getFriendlyEntityName('services','nginx', 'say');
            expect(entity).to.equal('Engine-X');
        });

        it('shouldnt find this server but still generate the best possible friendly name', function() {
            let entity = getFriendlyEntityName('services','  this_is-a_randomService', 'show');
            expect(entity).to.equal('this is a random service');
        });
    });
});