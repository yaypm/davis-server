'use strict';

const chai = require('chai');

chai.use(require('chai-as-promised'));

chai.should();

const Nlp = require('../../lib/classes/PluginManager/Nlp');
const Davis = require('../../lib/Davis');

describe('Nlp', () => {
  const davis = new Davis();
  const Exchange = davis.classes.Exchange;
  const nlp = new Nlp(davis, { apps: [
    {
      name: 'Test App',
      variants: ['test app', 'testapp', 'testing app'],
    },
  ] });

  nlp.addDocument('what happened yesterday with testapp', 'problem');
  nlp.addDocument('what version are you running');
  nlp.train();

  const exchange = new Exchange(davis, { id: 'testuser', timezone: 'America/Detroit' });
  const started = exchange.start('what happened yesterday with testapp', 'alexa')
            .then(e => nlp.classify(e));

  it('should create with apps', () => {
    nlp.apps.should.have.lengthOf(1);
  });

  it('should add apps', () => {
    nlp.addApp({
      name: 'Testing DB',
      variants: ['testing db', 'test db'],
    });

    nlp.apps.should.have.lengthOf(2);
  });

  it('should classify strings', () =>
    started.then((nlpData) => {
      nlpData.intent.should.equal('problem');
    })
  );

  it('should extract datetimes', () =>
    started.then((nlpData) => {
      nlpData.datetime.body.should.equal('yesterday');
    })
  );

  it('should extract apps', () => {
    started.then((nlpData) => {
      nlpData.app.app.should.equal('Test App');
      nlpData.app.body.should.equal('testapp');
    });
  });
});
