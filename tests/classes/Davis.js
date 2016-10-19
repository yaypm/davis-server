'use strict';

const expect = require('chai').expect;
const Davis = require('../../lib/Davis');

describe('Davis', () => {
  let davis;

  beforeEach(() => {
    davis = new Davis();
  });

  describe('#constructor', () => {
    const configObj = { some: 'test' };
    const davisWithConfig = new Davis(configObj);

    expect(davisWithConfig.config.some).to.equal('test');

    it('should set the Davis version', () => {
      expect(davis.version.length).to.be.at.least(1);
    });
  });
});
