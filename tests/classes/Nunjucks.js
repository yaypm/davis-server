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
    const startTime = moment('2016-01-01');
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
    compact.should.eql('01/01/2016 at 12:00 AM - \\n01/06/2016 at 12:00 AM');
  });

  it('should recognize when the range goes past now', () => {
    const timezone = 'America/Detroit';
    const context = {
      user: { timezone },
      timeRange: {
        startTime: moment('2016-01-01'),
        stopTime: moment().add(1, 'week'),
      },
    };

    const out = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user) }}', context);
    const compact = nunjucks.renderString('{{ timeRange | friendlyTimeRange(user, true) }}', context);

    out.should.eql('between 01/01/2016 at 12:00 AM and now');
    compact.should.contain('01/01/2016 at 12:00 AM - now');
  });

  it('should recognize when the range is in the same 24 hours', () => {
    const timezone = 'America/Detroit';
    const startTime = moment('2016-01-01');
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
    compact.should.eql('01/01/2016 at 12:00 AM - \\n01/06/2016 at 12:00 AM');
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
    compact.should.eql('<!date^1451624400^{date_num} {time}|01/01/2016> - <!date^1452056400^{date_num} {time}|01/06/2016>');
  });
});
