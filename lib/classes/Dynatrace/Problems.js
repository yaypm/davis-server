'use strict';

const _ = require('lodash');
const moment = require('moment-timezone');
require('moment-round');
const events = require('./events');

const STATUS_PRIORITY = ['OPEN', 'CLOSED'];
const IMPACT_PRIORITY = ['APPLICATION', 'SERVICE', 'INFRASTRUCTURE'];


class Problems {
  constructor(davis, problems, sort) {
    this.logger = davis.logger;
    this.davis = davis;
    let plist = problems || [];

    this.length = 0;
    this.push = Array.prototype.push;

    if (_.isNil(sort) || sort) {
      // _.sortBy sorts stably, which means we can use it as a multi-level sort
      plist = _.sortBy(plist, e => e.startTime);
      plist = _.sortBy(plist, e => !e.hasRootCause);
      plist = _.sortBy(plist, e => _.findIndex(events, { name: this.findMostImportantImpact(e) }));
      plist = _.sortBy(plist, e => IMPACT_PRIORITY.indexOf(e.impactLevel));
      plist = _.sortBy(plist, e => STATUS_PRIORITY.indexOf(e.status)); // top priority sort last
    }

    this._setProblems(plist);
  }

  filter(f) {
    const problems = [];
    for (let i = 0; i < this.length; i += 1) {
      problems.push(this[i]);
    }
    const newProblems = _.filter(problems, f);
    return new Problems(this.davis, newProblems, false);
  }

  toArray() {
    const problems = [];
    for (let i = 0; i < this.length; i += 1) {
      problems.push(this[i]);
    }
    return problems;
  }

  _setProblems(problems) {
    _.forEach(problems, p => this.push(p));
  }

  findMostImportantImpact(problem) {
    let highestRankedImpact = null;
    let highestRankedImpactName = null;

    _.forEach(problem.rankedImpacts, (impact) => {
      const category = _.chain(events)
              .find(e => e.name === impact.eventType)
              .get('type')
              .value();

      if (category === 'availability') {
        highestRankedImpact = 'availability';
        highestRankedImpactName = impact.eventType;
      } else if (category === 'errors' && highestRankedImpact !== 'errors') {
        highestRankedImpact = 'errors';
        highestRankedImpactName = impact.eventType;
      } else if (category === 'performance' && highestRankedImpact !== 'performance') {
        highestRankedImpact = 'performance';
        highestRankedImpactName = impact.eventType;
      } else if (category === 'resources' && highestRankedImpact !== 'resources') {
        highestRankedImpact = 'resources';
        highestRankedImpactName = impact.eventType;
      } else if (_.isNull(highestRankedImpact)) {
        this.logger.debug(`Uncategorized impact '${impact.eventType}'`);
      }
    });
    return highestRankedImpactName;
  }


  _noProblems(exchange, dateRange) {
    return ['Nice, there were no problems detected', dateRange, '.'];
  }

  _coupleProblems(exchange, dateRange) {
    const context = exchange.getContext();
    const intent = null;
    return (this.length === 1) ?
      ['The only problem', dateRange, 'was', Problems.problemSummary(this[0], context, intent, this.davis).text] :
      [dateRange, 'there was', Problems.problemSummary(this[0], context, intent, this.davis).text, 'There was also', Problems.problemSummary(this[1], context, intent, this.davis).text];
  }

  _manyProblems(exchange, dateRange) {
    const problems = this.toArray();
    const applicationProblems = problems.filter(p => p.impactLevel === 'APPLICATION');
    const rooted = problems.filter(p => p.hasRootCause);

    const names = {};
    const impacts = _.flatMap(problems, p => p.rankedImpacts);
    impacts.forEach((impact) => {
      names[impact.entityId] = impact.entityName;
    });

    this.davis.pluginManager.entities.applications.forEach((app) => {
      names[app.entityId] = app.display.visual;
    });

    this.davis.pluginManager.entities.services.forEach((srvc) => {
      names[srvc.entityId] = srvc.display.visual;
    });

    const sentence = [dateRange, 'there were', this.length, 'problems that affected', this._appSummary(exchange), 'and', this._serviceSummary(), '.'];

    this._heavilyAffectedApplications(applicationProblems, sentence, names);
    this._heavilyAffectedRoots(rooted, sentence, names);
    this._heavilyAffectedTime(exchange, problems, sentence);

    return sentence;
  }

  _heavilyAffectedTime(exchange, problems, seed) {
    const VB = this.davis.classes.VB;
    const startTimes = problems.map(p => Number(p.startTime)).sort();
    const min = _.min(startTimes);
    const range = _.max(startTimes) - min;
    const binSize = range / 100;

    const timeBins = startTimes.map(ts =>
      problems.filter(p =>
        p.startTime >= ts && p.startTime <= (ts + binSize)));

    const bigBin = _.maxBy(timeBins, time => time.length);
    const avgBinSize = _.meanBy(timeBins, bin => bin.length);
    const stdBinSize = Math.sqrt(
      _.meanBy(_.map(timeBins, bin => Math.pow(bin.length - avgBinSize, 2)))); // eslint-disable-line no-restricted-properties

    const ts = new VB.TimeStamp(moment(1000 * _.meanBy(bigBin, bin => bin.startTime / 1000))
      .round(15, 'minutes'), exchange.timezone);

    const threshold = avgBinSize + stdBinSize;
    const bigThreshold = avgBinSize + (2 * stdBinSize);
    if (bigBin.length > bigThreshold) {
      seed.push('There was an unusually strong concentration of problems around', ts, '.');
    } else if (bigBin.length > threshold) {
      seed.push('The greatest concentration of problems was around', ts, '.');
    }
  }

  _heavilyAffectedRoots(rooted, sentence, names) {
    const counts = _.countBy(_.flatten(rooted.map(problem =>
      _.uniq(problem.rankedEvents.filter(e => e.isRootCause).map(event => event.entityId)))));

    const mean = _.mean(_.values(counts));
    const std = Math.sqrt(_.mean(_.map(_.values(counts), c => Math.pow(c - mean, 2)))); // eslint-disable-line no-restricted-properties
    const threshold = mean + (2 * std);

    const heavilyAffected = _.pickBy(counts, v => v > threshold);
    const mostHeavilyAffected = _.maxBy(Object.keys(heavilyAffected), i => heavilyAffected[i]);

    if (mostHeavilyAffected) {
      const type = mostHeavilyAffected.split('-').toLowerCase();
      sentence.push('The', type, names[mostHeavilyAffected], 'was particularly troublesome, causing', heavilyAffected[mostHeavilyAffected], 'problems.');
    }
  }

  _heavilyAffectedApplications(problems, sentence, names) {
    const counts = _.countBy(_.flatten(problems.map(problem =>
      _.uniq(problem.rankedImpacts.map(impact => impact.entityId)))));

    const mean = _.mean(_.values(counts));
    const std = Math.sqrt(_.mean(_.map(_.values(counts), c => Math.pow(c - mean, 2)))); // eslint-disable-line no-restricted-properties
    const threshold = mean + (2 * std);

    const heavilyAffected = _.pickBy(counts, (v, k) => v > threshold && k.startsWith('APPLICATION'));
    const mostHeavilyAffected = _.maxBy(Object.keys(heavilyAffected), i => heavilyAffected[i]);

    if (mostHeavilyAffected) {
      sentence.push(names[mostHeavilyAffected], 'was the most heavily affected application with', heavilyAffected[mostHeavilyAffected], 'problems.');
    }
  }

  _appSummary(exchange) {
    const appFilter = exchange.getContext().nlp.app.app;
    const allImpacts = _.flatten(this.toArray().map(p => p.rankedImpacts));
    const affectedEntities = _.uniq(_.map(allImpacts, impact => impact.entityId));
    const applications = this.davis.pluginManager.entities.applications;

    const apps = _.filter(applications, app =>
        affectedEntities.indexOf(app.entityId) !== -1);

    // const affectedAppStrings = _.map(affectedApps, app => app.display.visual);

    if (appFilter) {
      return appFilter.display.visual;
    }

    if (apps.length === 1) {
      return apps[0].display.visual;
    }

    return `${apps.length} applications`;

    // let out = affectedAppStrings[0];

    // if (affectedAppStrings.length > 1) {
    //   const others = affectedAppStrings.length - 1;
    //   out += ` and ${others} other${(others > 1) ? 's' : ''}`;
    // }

    // return out || 'no applications';
  }

  _serviceSummary() {
    const allImpacts = _.flatten(this.toArray().map(p => p.rankedImpacts));
    const affectedEntities = _.uniq(_.map(allImpacts, impact => impact.entityId));
    const services = this.davis.pluginManager.entities.services;

    const srvs = _.filter(services, srv =>
        affectedEntities.indexOf(srv.entityId) !== -1);

    return `${srvs.length} service${(srvs.length !== 1) ? 's' : ''}`;
  }

  summarize(exchange, dateRange) {
    return ((n) => {
      switch (n) {
        case 0:
          return this._noProblems(exchange, dateRange);
        case 1:
        case 2:
          return this._coupleProblems(exchange, dateRange);
        default:
          return this._manyProblems(exchange, dateRange);
      }
    })(this.length);
  }
}


Problems.title = function (problem, davis, text) {
  const th = davis.textHelpers;

  const impactLevel = problem.impactLevel;
  const titleEvent = _.find(problem.rankedImpacts || problem.rankedEvents, { impactLevel });

  const applications = davis.pluginManager.entities.applications;
  const services = davis.pluginManager.entities.services;

  const search = { entityId: titleEvent.entityId };
  const entity = _.find(applications, search) || _.find(services, search);
  const entityName = (entity) ? entity.display.visual : titleEvent.entityName;

  const root = problem.hasRootCause ? '[Root Cause]' : '';

  return (text) ?
    `${th.humanize(titleEvent.eventType)} on ${entityName}` :
    `${th.toTitleCase(th.humanize(titleEvent.eventType))} on ${entityName} ${root}`.trim();
};

Problems.problemSummary = function (problem, context, intent, davis) {
  const id = problem.id;
  const VB = davis.classes.VB;
  const th = davis.textHelpers;
  const isOpen = problem.status === 'OPEN';

  const applications = context.entities.applications;
  const services = context.entities.services;

  const affectedEntities = problem.rankedImpacts.map(e =>
      e.entityId);


  const affectedApps = applications.filter(e =>
      affectedEntities.indexOf(e.entityId) !== -1);

  const affectedServices = services.filter(e =>
      affectedEntities.indexOf(e.entityId) !== -1);

  const appsText = affectedApps.map((app) => {
    const visual = app.display.visual;
    return visual;
  });

  const servicesText = affectedServices.map((service) => {
    const visual = service.display.visual;
    return th.stripPorts(visual);
  });

  const topEvent = th.eventTitle(problem.rankedImpacts[0]);
  const timeFrame = new VB.TimeRange(problem, context.user.timezone, true);
  const problemTitle = Problems.title(problem, davis);

  const show = new VB.Card()
    .setColor(problem.status)
    .addTitle(problemTitle)
    .setLink(th.buildProblemUrl(problem))
    .addField('Time Frame', timeFrame)
    .addField('Top Event', topEvent, true);

  if (affectedApps.length > 0) {
    show.addField('Affected Applications', appsText.slice(0, 3).join('\n'), true);
  } else if (affectedServices.length > 0) {
    show.addField('Affected Services', servicesText.slice(0, 3).join('\n'), true);
  }

  const impactLevel = problem.impactLevel;

  const titleImpact = _.find(problem.rankedImpacts, { impactLevel });
  const text = [th.friendlyEventFirstAlias(titleImpact.eventType)];

  if (!isOpen) {
    if (appsText.length > 0) {
      text.push(`that affected ${appsText[0]}`);
      if (appsText.length > 1) {
        const others = appsText.length - 1;
        text.push(`and ${others} other${(others > 1) ? 's' : ''}.`);
      } else {
        text.push('.');
      }
    } else if (servicesText.length > 0) {
      text.push(`that affected ${servicesText[0]}`);
      if (servicesText.length > 1) {
        const others = servicesText.length - 1;
        text.push(`and ${others} other${(others > 1) ? 's' : ''}.`);
      } else {
        text.push('.');
      }
    } else {
      text.push('.');
    }
  } else if (appsText.length > 0) {
    text.push(`that is currently affecting ${appsText[0]}`);
    if (appsText.length > 1) {
      const others = appsText.length - 1;
      text.push(`and ${others} other${(others > 1) ? 's' : ''}.`);
    } else {
      text.push('.');
    }
  } else if (servicesText.length > 0) {
    text.push(`that is currently affecting ${servicesText[0]}`);
    if (servicesText.length > 1) {
      const others = servicesText.length - 1;
      text.push(`and ${others} other${(others > 1) ? 's' : ''}.`);
    } else {
      text.push('.');
    }
  } else {
    text.push('is currently ongoing but not affecting any applications.');
  }

  return {
    intent,
    show,
    text,
    id,
  };
};

module.exports = Problems;
