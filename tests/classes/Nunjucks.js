'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const moment = require('moment-timezone');
const Davis = require('../../lib/Davis');

chai.use(chaiAsPromised);
chai.should();

describe('Nunjucks', () => {
  const davis = new Davis();
  const nunjucks = davis.pluginManager.responseBuilder.nunjucks;

  it('should create friendly time ranges', () => {
    const timezone = 'America/Detroit';
    const startTime = moment('2016-01-01').tz(timezone);
    const stopTime = moment('2016-01-01').add(5, 'days');
    const context = {
      user: { timezone },
      timeRange: {
        startTime,
        stopTime,
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);

    out.should.eql('between 01/01/2016 at 12:00 AM and 01/06/2016 at 12:00 AM');
    compact.should.eql('01/01/2016 at 12:00 AM  - \\n01/06/2016 at 12:00 AM');
  });

  it('should recognize when the range goes past now', () => {
    const timezone = 'America/Detroit';
    const context = {
      user: { timezone },
      timeRange: {
        startTime: moment('2016-01-01').tz(timezone),
        stopTime: moment().tz(timezone).add(1, 'week'),
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);

    out.should.eql('between 01/01/2016 at 12:00 AM and now');
    compact.should.contain('01/01/2016 at 12:00 AM  - today');
  });

  it('should recognize when the range is in the same 24 hours', () => {
    const timezone = 'America/Detroit';
    const startTime = moment('2016-01-01').tz(timezone);
    const stopTime = moment('2016-01-01').add(5, 'days');
    const context = {
      user: { timezone },
      timeRange: {
        startTime,
        stopTime,
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);

    out.should.eql('between 01/01/2016 at 12:00 AM and 01/06/2016 at 12:00 AM');
    compact.should.eql('01/01/2016 at 12:00 AM  - \\n01/06/2016 at 12:00 AM');
  });
});
