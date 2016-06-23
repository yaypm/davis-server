'use strict';

const chai = require('chai'),
    expect = chai.expect,
    moment = require('moment-timezone'),
    rewire = require('rewire'),
    Ruxit = rewire('../../../../app/core/dynatrace/ruxit'),
    problemSummary = require('../../../mock_data/dynatrace/ruxit/summary.json');

describe('Test the ruxit api filters', function() {
    describe('Tests the application filter', function() {
        // Loading in the private time filter method
        const isApplicationAffected = Ruxit.__get__('isApplicationAffected');

        it('should return false because the problem didn\'t affect an application', function() {
            expect(isApplicationAffected('login', problemSummary.result.problems[1])).to.be.false;
        });
        it('should return true because the problem affected the Costco application', function() {
            expect(isApplicationAffected('Costco', problemSummary.result.problems[0])).to.be.true;
        });
        it('should return false because the problem didn\'t affect the login application', function() {
            expect(isApplicationAffected('login', problemSummary.result.problems[3])).to.be.false;
        });
    });

    describe('Tests the time filter', function() {
        // Loading in the private time filter method
        const getTimeFilter = Ruxit.__get__('getTimeFilter');

        it('should return an hour filter', function() {
            let filter = getTimeFilter();
            expect(filter.relativeTime).to.equal('hour');
        });

        it('should return an two hour filter', function() {
            let filter = getTimeFilter(moment().subtract(70, 'minutes'));
            expect(filter.relativeTime).to.equal('2hours');
        });

        it('should return a six hour filter', function() {
            let filter = getTimeFilter(moment().subtract(5, 'hours'));
            expect(filter.relativeTime).to.equal('6hours');
        });

        it('should return a day filter', function() {
            let filter = getTimeFilter(moment().subtract(10, 'hours'));
            expect(filter.relativeTime).to.equal('day');
        });

        it('should return a week filter', function() {
            let filter = getTimeFilter(moment().subtract(25, 'hours'));
            expect(filter.relativeTime).to.equal('week');
        });

        it('should return a month filter', function() {
            let filter = getTimeFilter(moment().subtract(8, 'days'));
            expect(filter.relativeTime).to.equal('month');
        });

        it('should return a month filter dispite being passed two months', function() {
            let filter = getTimeFilter(moment().subtract(2, 'months'));
            expect(filter.relativeTime).to.equal('month');
        });
    });
});