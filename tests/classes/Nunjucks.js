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
    const startTime = moment.tz('2016-01-01', timezone);
    const stopTime = moment.tz('2016-01-01', timezone).add(5, 'days');
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
    compact.should.eql('01/01/2016 at 12:00 AM - \\n01/06/2016 at 12:00 AM');
  });

  it('should recognize when the range goes past now', () => {
    const timezone = 'America/Detroit';
    const context = {
      user: { timezone },
      timeRange: {
        startTime: moment.tz('2016-01-01', timezone),
        stopTime: moment().tz(timezone).add(1, 'week'),
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);

    out.should.eql('between 01/01/2016 at 12:00 AM and now');
    compact.should.contain('01/01/2016 at 12:00 AM - now');
  });

  it('should recognize when the range is in the same 24 hours', () => {
    const startTime = moment('2016-01-01T00:00:00-05:00');
    const stopTime = moment('2016-01-01T00:00:00-05:00').add(5, 'days');
    const context = {
      user: { timezone: 'America/Detroit' },
      timeRange: {
        startTime,
        stopTime,
      },
    };

    const caliContext = {
      user: { timezone: 'America/Los_Angeles' },
      timeRange: {
        startTime,
        stopTime,
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const outCali = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', caliContext);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);
    const compactCali = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', caliContext);

    out.should.eql('between 01/01/2016 at 12:00 AM and 01/06/2016 at 12:00 AM');
    outCali.should.eql('between 12/31/2015 at 9:00 PM and 01/05/2016 at 9:00 PM');
    compact.should.eql('01/01/2016 at 12:00 AM - \\n01/06/2016 at 12:00 AM');
    compactCali.should.eql('12/31/2015 at 9:00 PM - \\n01/05/2016 at 9:00 PM');
  });

  it('should generate slack time objects', () => {
    const timezone = 'America/Detroit';
    const startTime = moment.unix(1451624400);
    const stopTime = moment.unix(1451624400).add(5, 'days');
    const context = {
      user: { timezone },
      timeRange: {
        startTime,
        stopTime,
      },
    };
    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, false, "visual") }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true, "visual") }}', context);

    out.should.eql('between <!date^1451624400^{date_short_pretty} {time}|01/01/2016> and <!date^1452056400^{date_short_pretty} {time}|01/06/2016>');
    compact.should.eql('<!date^1451624400^{date_short_pretty} {time}|01/01/2016> -\\n<!date^1452056400^{date_short_pretty} {time}|01/06/2016>');
  });
});
