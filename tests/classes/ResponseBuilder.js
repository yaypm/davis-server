'use strict';

const chai = require('chai');
const BbPromise = require('bluebird');

chai.use(require('chai-as-promised'));

chai.should();

const Nlp = require('../../lib/classes/Nlp');
const Davis = require('../../lib/Davis');

describe('ResponseBuilder', () => {
  const davis = new Davis();
  const Exchange = davis.classes.Exchange;

  it('should respond with text inputs', () => {
    const e1 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e2 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e3 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });

    const p1 = e1.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          text: 'test response',
        });

        return davis.pluginManager.responseBuilder.build(e);
      });

    const p2 = e2.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          say: 'test response',
        });

        return davis.pluginManager.responseBuilder.build(e);
      });

    const p3 = e3.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          show: {
            text: 'test response',  
          },
        });
        return davis.pluginManager.responseBuilder.build(e);
      });

    return BbPromise.all([p1, p2, p3])
      .spread((r1, r2, r3) => {
        const r = {
          text: 'test response',
          say: 'test response',
          show: {
            text: 'test response',
          },
        };
        r1.should.eql(r);
        r2.should.eql(r);
        r3.should.eql(r);
      });
  });

  it('should respond with text template input', () => {
    const e1 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e2 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e3 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });

    const p1 = e1.start('what happened yesterday with testapp', 'alexa')
      .then(e => {

        e.addContext({
          variable: "response",
        });

        e.response({
          textString: 'test {{variable}}',
        });

        return davis.pluginManager.responseBuilder.build(e);
      });

    const p2 = e2.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.addContext({
          variable: "response",
        });
        e.response({
          sayString: 'test {{variable}}',
        });

        return davis.pluginManager.responseBuilder.build(e);
      });

    const p3 = e3.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.addContext({
          variable: "response",
        });
        e.response({
          showString: '{"text": "test {{variable}}"}',
        });
        return davis.pluginManager.responseBuilder.build(e);
      });

    return BbPromise.all([p1, p2, p3])
      .spread((r1, r2, r3) => {
        const r = {
          text: 'test response',
          say: 'test response',
          show: {
            text: 'test response',
          },
        };
        r1.should.eql(r);
        r2.should.eql(r);
        r3.should.eql(r);
      });
  });
});
