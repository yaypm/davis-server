'use strict';

const _ = require('lodash');
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
}

Problems.title = function (problem, davis, audible) {
  const th = davis.textHelpers;

  const impactLevel = problem.impactLevel;
  const titleEvent = _.find(problem.rankedImpacts || problem.rankedEvents, { impactLevel });

  const applications = davis.pluginManager.entities.applications;
  const services = davis.pluginManager.entities.services;

  const search = { entityId: titleEvent.entityId };
  const entity = _.find(applications, search) || _.find(services, search);
  const entityName = (entity) ? entity.display.visual : titleEvent.entityName;

  return (audible) ?
    `${th.humanize(titleEvent.eventType)} on ${entityName}` :
    `${problem.displayName}: ${th.toTitleCase(th.humanize(titleEvent.eventType))} on ${entityName}`;
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
  const titleEvent = _.find(problem.rankedImpacts || problem.rankedEvents, { impactLevel });

  const titleImpact = _.find(problem.rankedImpacts, { impactLevel })
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
    show: show.slack(),
    text: VB.stringify(text),
    id,
  };
};

module.exports = Problems;
