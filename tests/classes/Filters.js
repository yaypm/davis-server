'use strict';

const chai = require('chai');

chai.should();

const Davis = require('../../lib/Davis');

describe('Filters', () => {
  const davis = new Davis();

  it('should create a global filter', () => {

    return davis.filters.createFilter({
      name: 'test global filter',
      owner: 'userId', // update
      scope: 'global',
    })
  });
});
