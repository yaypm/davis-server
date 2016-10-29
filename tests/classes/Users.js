'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

chai.should();

const Davis = require('../../lib/Davis');

describe('Users', () => {
  const davis = new Davis();
  const users = davis.users;

  const email = 'testuser@dynatrace.com';

  it('should return a list of timezones',
    () => users.getValidTimezones().should.contain('america/detroit'));

  it('should not find a valid Alexa user',
    () => users.validateAlexaUser('shouldNotExist').should.eventually.be.rejected);

  it('should find a valid Alexa user', () => {
    const alexaID = 'shouldExist';

    return users.createUser(email, 'test', true)
      .then(() => users.updateUser(email, { alexa_ids: [alexaID] }))
      .then(() => users.validateAlexaUser(alexaID))
      .then(user => (user.email).should.equal(email));
  });

  it('should fail to update the timezone',
    () => users.updateUser(email, { timezone: 'invalid' }).should.eventually.be.rejected);

  it('should successfully update the timezone',
    () => users.updateUser(email, { timezone: 'america/detroit' }).should.eventually.be.resolved);
});
