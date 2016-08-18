'use strict';

const chai = require('chai'),
    expect = chai.expect,
    Ruxit = require('../../../../app/core/dynatrace');

describe('Tests the time range generator', function() {
    it('should return a time range with minute granularity', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'minute',
            'values': []
        });

        expect(timeRange.startTime.unix()).to.equal(1465779300);
        expect(timeRange.stopTime.unix()).to.equal(1465779900);
    });

    it('should return a time range with hour granularity', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'hour',
            'values': []
        });

        expect(timeRange.startTime.unix()).to.equal(1465778700);
        expect(timeRange.stopTime.unix()).to.equal(1465780500);
    });

    it('should return a time range with day granularity', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'day',
            'values': []
        });

        expect(timeRange.startTime.unix()).to.equal(1465704000);
        expect(timeRange.stopTime.unix()).to.equal(1465790399);
    });

    it('should return a time range with week granularity', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'week',
            'values': []
        });

        expect(timeRange.startTime.unix()).to.equal(1465704000);
        expect(timeRange.stopTime.unix()).to.equal(1466308799);
    });

    it('should return a time range with month granularity', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'month',
            'values': []
        });

        expect(timeRange.startTime.unix()).to.equal(1464753600);
        expect(timeRange.stopTime.unix()).to.equal(1467345599);
    });

    it('should return a time range with month granularity despite being passed a year', function() {
        let timeRange = Ruxit.generateTimeRange({
            'confidence': 1,
            'type': 'value',
            'value': '2016-06-12T21:00:00.000-04:00',
            'grain': 'year',
            'values': []
        });

        expect(timeRange).to.be.undefined;
    });
});
