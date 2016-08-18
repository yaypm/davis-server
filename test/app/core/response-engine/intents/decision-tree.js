'use strict';

const Decide = require('../../../../../app/core/response-engine/utils/decide'),
    problemTrainingData = require('../../../../../app/core/response-engine/intents/problem/model'),
    chai = require('chai'),
    expect = chai.expect;

describe('Tests the decision tree', function() {
    describe('Tests the problem decision tree', function() {
        let decide = new Decide(problemTrainingData);
        it('should find the past zero template', function() {
            let template = decide.template({lang: 'en-us',tense: 'past',problems: 'zero'});
            expect(template).to.equal('en-us/tense/past/zero');
        });

        it('should find the past one template', function() {
            let template = decide.template({lang: 'en-us',tense: 'past',problems: 'one'});
            expect(template).to.equal('en-us/tense/past/one');
        });

        it('should find the past two template', function() {
            let template = decide.template({lang: 'en-us',tense: 'past',problems: 'two'});
            expect(template).to.equal('en-us/tense/past/two');
        });

        it('should find the past many template', function() {
            let template = decide.template({lang: 'en-us',tense: 'past',problems: 'many'});
            expect(template).to.equal('en-us/tense/past/many');
        });

        it('should find the present zero template', function() {
            let template = decide.template({lang: 'en-us',tense: 'present',problems: 'zero'});
            expect(template).to.equal('en-us/tense/present/zero');
        });

        it('should find the present one template', function() {
            let template = decide.template({lang: 'en-us',tense: 'present',problems: 'one'});
            expect(template).to.equal('en-us/tense/present/one');
        });

        it('should find the present two template', function() {
            let template = decide.template({lang: 'en-us',tense: 'present',problems: 'two'});
            expect(template).to.equal('en-us/tense/present/two');
        });

        it('should find the present many template', function() {
            let template = decide.template({lang: 'en-us',tense: 'present',problems: 'many'});
            expect(template).to.equal('en-us/tense/present/many');
        });
    });
});