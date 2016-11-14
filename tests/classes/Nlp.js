'use strict';

const chai = require('chai');
const nock = require('nock');

chai.use(require('chai-as-promised'));

chai.should();

const Nlp = require('../../lib/classes/PluginManager/Nlp');
const Davis = require('../../lib/Davis');
const davisParserData = require('../mock_data/nlp/yesterday.json');

describe('Nlp', () => {
  const davis = new Davis();
  const Exchange = davis.classes.Exchange;
  after(() => nock.restore());
  nock('https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com')
    .post('/prod/datetime')
    .reply(200, davisParserData);

  const nlp = new Nlp(davis, { apps: [
    {
      name: 'Test App',
      category: '',
      entityId: '',
      display: {
        visual: '',
        audible: '',
      },
      aliases: ['test app', 'testapp', 'testing app'],
    },
  ]});

  nlp.addDocument('what happened yesterday with testapp', 'problem');
  nlp.addDocument('what version are you running');
  nlp.train();

  const exchange = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
  const started = exchange.start('what happened yesterday with testapp', 'alexa')
            .then(e => nlp.process(e));

  it('should create with apps', () => {
    nlp.apps.should.have.lengthOf(1);
  });

  it('should add apps', () => {
    nlp.addApp({
      name: 'Testing DB',
      aliases: ['testing db', 'test db'],
    });

    nlp.apps.should.have.lengthOf(2);
  });

  it('should classify strings', () => {
    const classified = nlp.classify('what happened yesterday with testapp');
    classified.intent.should.equal('problem');
  });

  it('should extract datetimes', () =>
    started.then((nlpData) => {
      nlpData.datetime.body.should.equal('yesterday');
    })
  );

  it('should extract apps', () => {
    started.then((nlpData) => {
      nlpData.app.name.should.equal('Test App');
      nlpData.app.body.should.equal('testapp');
    });
  });
});
