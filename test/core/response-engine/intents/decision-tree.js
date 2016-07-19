'use strict';

require('../../../setup');
const DecisionEngine = require('../../../../app/core/response-engine/intents/DecisionEngine'),
    problemTrainingData = require('../../../../app/core/response-engine/intents/intents/problem/decision-model'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests the decision tree', function() {

    it('should find a template', function() {
        let decisionEngine = new DecisionEngine(problemTrainingData);

        let template = decisionEngine.getTemplate({'lang': 'en-us', 'error': false, 'tense': 'past', 'problems': 'zero'});
        expect(template).to.equal('en-us/tense/past/zero');
    });
});