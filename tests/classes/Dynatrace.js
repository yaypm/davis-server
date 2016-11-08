'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const _ = require('lodash');

const Davis = require('../../lib/Davis');

const problemSummary = require('../mock_data/dynatrace/summary.json');

chai.use(chaiAsPromised);
chai.should();

describe('Dynatrace', () => {
  const davis = new Davis();

  // Makes sure the nock doesn't interfere with the next test.
  after(() => nock.restore());

  it('should load in the Davis config', done => {
    davis.config.load()
      .then(() => done());
  });

  it('should get a filtered list of problems', done => {
    // Simulating Dynatrace call
    nock(davis.config.getDynatraceUrl())
      .get('/api/v1/problem/feed')
      .query(true)
      .reply(200, problemSummary);

    // Creating a fake exchange
    const exchange = {};
    _.set(exchange, 'model.request.analysed.timerange.startTime', 1465571160000);
    _.set(exchange, 'model.request.analysed.timerange.stopTime', 1465572960000);

    davis.dynatrace.getFilteredProblems(exchange)
      .then(problems => {
        problems.length().should.equal(15);
        done();
      });
  });
});
