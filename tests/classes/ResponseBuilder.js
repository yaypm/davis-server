'use strict';

const chai = require('chai');
const BbPromise = require('bluebird');

chai.use(require('chai-as-promised'));

chai.should();

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
          text: 'test response.',
        }).end();
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    const p2 = e2.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          say: 'test response.',
        }).end();
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    const p3 = e3.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          show: {
            text: 'test response.',
            attachments: [],
          },
        }).end();
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    return BbPromise.all([p1, p2, p3])
      .spread((r1, r2, r3) => {
        const r = {
          text: 'test response.',
          say: 'test response.',
          show: {
            text: 'test response.',
            attachments: [],
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

        e.addTemplateContext({
          variable: "response",
        });
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        e.response({
          textString: 'test {{variable}}.',
        }).end();

        return davis.pluginManager.responseBuilder.build(e);
      });

    const p2 = e2.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.addTemplateContext({
          variable: "response",
        });
        e.response({
          sayString: 'test {{variable}}.',
        }).end();
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    const p3 = e3.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.addTemplateContext({
          variable: "response",
        });
        e.response({
          showString: '{"text": "test {{variable}}."}',
        }).end();
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    return BbPromise.all([p1, p2, p3])
      .spread((r1, r2, r3) => {
        const r = {
          text: 'test response.',
          say: 'test response.',
          show: {
            text: 'test response.',
            attachments: [],
          },
        };
        r1.should.eql(r);
        r2.should.eql(r);
        r3.should.eql(r);
      });
  });

  it('should ask a follow up question', () => {
    const e1 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e2 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
    const e3 = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });

    const p1 = e1.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          text: 'test response.',
        }).followUp('Who am I?');
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    const p2 = e2.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          say: 'test response.',
        }).followUp('Who am I?');
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    const p3 = e3.start('what happened yesterday with testapp', 'alexa')
      .then(e => {
        e.response({
          show: {
            text: 'test response.',
            attachments: [],
          },
        }).followUp('Who am I?');
        e.model.request.analysed = {};
        e.model.request.analysed.timeRange = null;
        return davis.pluginManager.responseBuilder.build(e);
      });

    return BbPromise.all([p1, p2, p3])
      .spread((r1, r2, r3) => {
        const r = {
          text: 'test response.  Who am I?',
          say: 'test response. Who am I?',
          show: {
            text: 'test response.  Who am I?',
            attachments: [],
          },
        };
        r1.should.eql(r);
        r2.should.eql(r);
        r3.should.eql(r);
      });
  });
});
