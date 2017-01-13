'use strict';

const _ = require('lodash');

const PROMPTS = {
  OPEN: [
    'Great, the following problem has been resolved',
    'Nice! The following problem has been resolved',
    'Good news, the following problem has been resolved',
  ],
  CLOSED: [
    'I just wanted to let know that the following problem was detected',
    'I just wanted to give you a quick heads up that the following problem was detected',
  ],
};


class ProblemNotification {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problemNotification: {
        usage: 'Notify users proactively',
        lifecycleEvents: [
          'gatherData',
          'getScope',
          'notify',
        ],
        phrases: [],
      },
      ackNotification: {
        usage: 'Acknowledge or ignore a notification',
        lifecycleEvents: [
          'ack',
        ],
        phrases: [],
      },
    };

    this.hooks = {
      'problemNotification:gatherData': (exchange, context) => this.gatherData(exchange, context),
      'problemNotification:getScope': (exchange, context) => this.getScope(exchange, context),
      'problemNotification:notify': (exchange, context) => this.notify(exchange, context),
      'ackNotification:ack': (exchange, context) => this.ack(exchange, context),
    };
  }


  // Expects a pid to be on the conversationContext object
  gatherData(exchange, context) {
    const pid = context.pid;
    return this.davis.dynatrace.problemDetails(pid)
      .then((ret) => {
        const problem = ret.result;
        exchange.addContext({ problem });
      });
  }

  getScope(exchange, context) {
    return this.davis.filters.getNotificationFilters()
      .then((filters) => {
        const notificationScope = [];
        _.forEach(filters, (filter) => {
          if (filter.problemMatch(context.problem)) {
            console.log(`Add a scope from ${filter.name}`);
            notificationScope.push(filter.scope);
          }
        });
        exchange.setNotificationScope(notificationScope);
      });
  }

  notify(exchange, context) {
    const textHelpers = this.davis.textHelpers;
    const VB = this.davis.classes.VB;


    const problem = context.problem;
    const startingEvent = problem.rankedEvents[problem.rankedEvents.length - 1];
    const currentEvent = problem.rankedEvents[0];

    const fbTitle = textHelpers.toTitleCase(currentEvent.eventType).replace('A ', '');

    const initialEvent = textHelpers.eventTitle(startingEvent);

    const status = (problem.status === 'OPEN') ? 'Unresolved' : 'Resolved';

    const details = new VB.Card()
      // Set fallback
      .addFallback(`${fbTitle}\n`)
      .addFallback(`Impacted: ${textHelpers.friendlyEntityName(currentEvent)}\n`)
      .addFallback(`${textHelpers.capitalize(problem.impactLevel)}\n`)
      .addFallback(`Initial Event: ${initialEvent}\n`)
      .addFallback(`Status: ${status}`)
      // Color appropriately
      .setColor(problem.status)
      // Title is a link to the problem
      .addTitle(textHelpers.eventTitle(currentEvent))
      .setLink(textHelpers.buildProblemUrl(problem))
      // Set fields
      .addField(
          'Impacted',
          `${textHelpers.friendlyEntityName(currentEvent)}\n${textHelpers.capitalize(problem.impactLevel)}`,
          true)
      .addField(
          'Initial Event',
          initialEvent,
          true)
      .addField(
          'Time Frame',
          new VB.TimeRange(
            { startTime: problem.startTime, stopTime: problem.endTime },
            exchange.user.timezone,
            true),
          true)
      .addField('Status', (problem.status === 'OPEN') ? 'Unresolved' : 'Resolved', true);

    const msg = new VB.Message()
      .addText(_.sample(PROMPTS[problem.status]))
      .addCard(details);

    // Generate Root Cause Cards
    const roots = _.take(_.map(_.filter(problem.rankedEvents, e => e.isRootCause), root =>
      new VB.Card()
        .setColor(root.status)
        .addTitle(textHelpers.eventTitle(root))
        .addTitle((root.status === 'OPEN') ? 'Unresolved' : 'Resolved')
        .setLink(textHelpers.buildEventUrl(problem, root))
        .addField(
          'Impacted',
          textHelpers.friendlyEntityName(root),
          true)
        .addField(
          'Time Range',
          new VB.TimeRange(
            { startTime: root.startTime, stopTime: root.endTime },
            exchange.user.timezone,
            true),
          true)), 3);

    const buttons = new VB.ButtonGroup('ackNotification')
      .addAction('Acknowledge', 'Acknowledge', problem.id)
      .addAction('Ignore', 'Ignore', problem.id);

    // Add a subtitle over the root causes
    if (roots.length > 1) msg.addCard(new VB.Card().addTitle('Top root cause events'));
    if (roots.length === 1) msg.addCard(new VB.Card().addTitle('Root cause event'));

    // Add root causes to message
    msg.addCard(roots).setButtons(buttons);

    exchange
      .response({ show: msg.slack() })
      .end();
  }

  ack(exchange, context) {
    const VB = this.davis.classes.VB;
    const action = context.button.name;
    const pid = context.button.value;
    const msg = this.davis.utils.Slack.removeButtons(context.message.original_message);

    if (action === 'Acknowledge') {
      this.davis.logger.info(`${context.message.user_real_name} clicked acknowledge on ${pid}`);
      const comment = `${context.message.user_real_name} acknowledged this from Davis`;
      this.davis.dynatrace.addCommentToProblem(exchange, pid, comment);
    } else {
      this.davis.logger.info(`${context.message.user_real_name} clicked ignore on ${pid}`);
    }

    const resp = new VB.Card()
      .addText(`<@${context.message.user}> clicked ${action}`)
      .addText(new VB.TimeStamp(context.message.action_ts * 1000))
      .slack();
    msg.attachments.push(resp);
    exchange.response({
      show: msg,
    }).end();
  }
}

module.exports = ProblemNotification;
