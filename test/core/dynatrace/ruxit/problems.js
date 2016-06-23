'use strict';

const chai = require('chai'),
    expect = chai.expect,
    rewire = require('rewire'),
    nock = require('nock'),
    Ruxit = rewire('../../../../app/core/dynatrace/ruxit'),
    user = require('../../../../app/config/user'),
    problemSummary = require('../../../mock_data/dynatrace/ruxit/summary.json');

describe('Interacts with Ruxits API', function() {

    after(function() {
        nock.restore();
    });

    describe('Tests the problem API', function() {
        let ruxit = new Ruxit(user.ruxit.url, user.ruxit.token);
        it('should return a summary of current problems', function(done) {
            ruxit.problemStatus()
            .then(output => {
                expect(output.result.totalOpenProblemsCount).to.exist;
                done();
            })
            .catch( err => {
                if(err) done(err);
            });
        });

        it('should return active problems', function(done) {
            ruxit.activeProblems()
            .then(output => {
                expect(output.result.problems).to.exist;
                done();
            })
            .catch( err => {
                if(err) done(err);
            });
        });

        it('should returned a filtered list of problems', function(done) {
            let timeRange = Ruxit.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.ruxit.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            ruxit.getFilteredProblems(timeRange)
            .then(output => {
                expect(output.result.problems.length).to.equal(15);
                done();
            })
            .catch( err => {
                if(err) done(err);
            });
        });

        it('should returned a filtered list of costco application problems', function(done) {
            let timeRange = Ruxit.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.ruxit.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            ruxit.getFilteredProblems(timeRange, 'costco')
            .then(output => {
                expect(output.result.problems.length).to.equal(2);
                done();
            })
            .catch( err => {
                if(err) done(err);
            });
        });

        it('should returned a filtered list of costco and esmas application problems', function(done) {
            let timeRange = Ruxit.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.ruxit.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            ruxit.getFilteredProblems(timeRange, ['costco', 'esmas'])
            .then(output => {
                expect(output.result.problems.length).to.equal(3);
                done();
            })
            .catch( err => {
                if(err) done(err);
            });
        });
        it('should returned a empty list because the application doesn\'t exist', function(done) {
            let timeRange = Ruxit.generateTimeRange({
                'confidence': 1,
                'type': 'value',
                'value': 1465572060000,
                'grain': 'hour',
                'values': []
            });

            nock(user.ruxit.url)
                .get('/api/v1/problem/feed')
                .query(true)
                .reply(200, problemSummary);

            ruxit.getFilteredProblems(timeRange, 'random app name')
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