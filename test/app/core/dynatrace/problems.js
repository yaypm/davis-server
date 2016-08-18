'use strict';

const chai = require('chai'),
    expect = chai.expect,
    rewire = require('rewire'),
    nock = require('nock'),
    Dynatrace = rewire('../../../../app/core/dynatrace'),
    aliases = require('../../../mock_data/davis/aliases'),
    problemSummary = require('../../../mock_data/dynatrace/summary.json');

let user = {
    dynatrace: {
        token: null,
        url: null
    }
};

describe('Interacts with Dynatrace\'s API', function() {
    before(function() {
        if (process.env.DYNATRACE_URL && process.env.DYNATRACE_TOKEN) {
            user.dynatrace.token = process.env.DYNATRACE_TOKEN;
            user.dynatrace.url = process.env.DYNATRACE_URL;
        } else {
            console.log('skipping Dynatrace API tests because no credentials were found');
            this.skip();
        }
    });

    after(function() {
        nock.restore();
    });

    describe('Tests the problem API', function() {
        it('should return a summary of current problems', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            dynatrace.problemStatus()
                .then(output => {
                    expect(Number.isInteger(output.result.totalOpenProblemsCount)).to.be.true;
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });

        it('should return active problems', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            dynatrace.activeProblems()
                .then(output => {
                    expect(Number.isInteger(output.result.problems.length)).to.be.true;
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });

        it('should returned a filtered list of problems', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            let timeRange = Dynatrace.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.dynatrace.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            dynatrace.getFilteredProblems(timeRange)
                .then(output => {
                    expect(output.result.problems.length).to.equal(15);
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });

        it('should returned a filtered list of costco application problems', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            let timeRange = Dynatrace.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.dynatrace.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            dynatrace.getFilteredProblems(timeRange, 'costco')
                .then(output => {
                    expect(output.result.problems.length).to.equal(2);
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });

        it('should returned a filtered list of costco and esmas application problems', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            let timeRange = Dynatrace.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.dynatrace.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            dynatrace.getFilteredProblems(timeRange, ['costco', 'esmas'])
                .then(output => {
                    expect(output.result.problems.length).to.equal(3);
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });
        it('should returned a empty list because the application doesn\'t exist', function(done) {
            let dynatrace = new Dynatrace(user.dynatrace.url, user.dynatrace.token, aliases);
            let timeRange = Dynatrace.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.dynatrace.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            dynatrace.getFilteredProblems(timeRange, 'random app name')
                .then(output => {
                    expect(output.result.problems.length).to.equal(0);
                    done();
                })
                .catch( err => {
                    if(err) done(err);
                });
        });
    });
});