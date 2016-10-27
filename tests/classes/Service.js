'use strict';

const Davis = require('../../lib/Davis');

describe('Service', () => {
  describe('#constructor()', () => {
    const davis = new Davis();

    it('should connect to MongoDB', () => {
      davis.service.connectToMongoDB();
    });
  });
});
