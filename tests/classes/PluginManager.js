'use strict';

const chai = require('chai');
const BbPromise = require('bluebird');
const nock = require('nock');

chai.use(require('chai-as-promised'));

chai.should();

const Davis = require('../../lib/Davis');
const Exchange = require('../../lib/classes/Exchange');
const plugins = require('../../lib/plugins/Plugins.json')
const davisParserData = require('../mock_data/nlp/yesterday.json');

class MockPlugin {
  constructor(davis, options) {
    this.dir = __dirname;
    this.intents = {
      mockIntent: {
        usage: 'Testing Intet',
        phrases: [
          'test',
        ],
        lifecycleEvents: [
          'test',
        ],
      },
    };

    this.hooks = {
      'mockIntent:test': exchange => BbPromise.resolve(exchange).bind(this)
        .then(this.test),
    };
  }

  test(exchange) {
      exchange.tested = true;
      exchange.response('hi').end();
  }
}

describe('ResponseBuilder', () => {
  const davis = new Davis();
  after(() => nock.restore());
  nock('https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com')
    .post('/prod/datetime')
    .reply(200, davisParserData);

  it('should load core plugins', () => {
    davis.pluginManager.loadCorePlugins();
    davis.pluginManager.plugins.length.should.eql(plugins.intents.length);
  });

  it('should load user plugins', () => {
    davis.pluginManager.loadUserPlugins([MockPlugin]);
    davis.pluginManager.plugins.length.should.eql(plugins.intents.length + 1);
  })

  it('should have user intent', () => {
    davis.pluginManager.getIntents().should.include.keys('mockIntent');
  });

  it('should have problem intent', () => {
    davis.pluginManager.getIntents().should.include.keys('problem');
  });

  it('should grab intents', () => {
    davis.pluginManager.getIntent('mockIntent').should.deep.equal({
    pluginName: 'MockPlugin',
    intents: undefined,
    key: 'mockIntent',
    usage: 'Testing Intet',
    phrases: [
      'test',
    ],
    lifecycleEvents: [
      'test',
    ],
    });
  });

  it('should get events', () => {
    davis.pluginManager.getEvents(davis.pluginManager.getIntent('mockIntent'))
      .should.eql(['before:mockIntent:test', 'mockIntent:test', 'after:mockIntent:test']);
  });

  it('should run intents', () => {
    return new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' })
      .start('test', 'alexa')
      .then(e => davis.pluginManager.run(e, 'mockIntent'))
      .then(e => e.tested.should.equal(true));
  });
});
