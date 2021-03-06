'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

chai.should();

const Davis = require('../../lib/Davis');

describe('Exchange', () => {
  const davis = new Davis();
  const Exchange = davis.classes.Exchange;

  it('should create a new exchange', () => {
    const exchange = new Exchange(davis, { id: 'testuser' });

    return exchange.start('What happened yesterday?', 'alexa', 'test')
      .then(e => {
        e.isFirstInteraction().should.be.true;
        return e.save();
      });
  });

  it('should create another exchange with history', () => {
    const exchange = new Exchange(davis, { id: 'testuser' });

    return exchange.start('What about today?', 'alexa', 'test')
      .then(e => {
        e.isFirstInteraction().should.be.false;
        return e.save();
      });
  });
});
