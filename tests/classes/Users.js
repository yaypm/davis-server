'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Davis = require('../../lib/Davis');

describe('Users', () => {
  const davis = new Davis();
  const users = new davis.classes.Users(davis);

  it('should not find a valid Alexa user',
    () => expect(users.validateAlexaUser('shouldNotExist')).to.be.rejected
  );

  it('should find a valid Alexa user', () => {
    const email = 'testuser@dynatrace.com';
    const alexaID = 'shouldExist';

    return users.createUser(email, 'test', true)
      .then(() => users.updateUser(email, { alexa_ids: [alexaID] }))
      .then(() => users.validateAlexaUser(alexaID))
      .then(user => expect(user.email).to.equal(email));
  });
});
