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



describe('PluginManager', () => {
  const davis = new Davis({
    userPlugins: [
      './tests/mock_data/plugin_manager/mock-plugin',
    ],
  });
  after(() => nock.cleanAll());
  nock('https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com')
    .post('/prod/datetime')
    .reply(200, davisParserData);

  it('should load plugins', () => {
    davis.pluginManager.loadCorePlugins();
    davis.pluginManager.loadUserPlugins([
      './tests/mock_data/plugin_manager/mock-plugin',
    ])
    davis.pluginManager.plugins.length.should.eql(plugins.intents.length + 1);
  });

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
    usage: 'Testing Intent',
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
      .start('test', 'alexa', 'test')
      .then(e => davis.pluginManager.run(e, 'mockIntent'))
      .then(e => e.tested.should.equal(true));
  });
});
