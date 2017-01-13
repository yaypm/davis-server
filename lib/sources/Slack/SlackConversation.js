'use strict';

const BbPromise = require('bluebird');
const error = require('../../classes/Utils/Error');
const slack = require('../../config/slack');
const moment = require('moment-timezone');
const _ = require('lodash');


/**
 * Slack conversation
 * Interacts with botkit to allow conversation flow within Slack
 */
class SlackConversation {
  constructor(davis, sharedStorage) {
    this.logger = davis.logger;
    this.resetInterval = false;
    this.isDirectMessage = false;
    this.pluginManager = davis.pluginManager;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
    this.utils = davis.utils.Slack;
    this.sharedStorage = sharedStorage || {};
  }

  /**
   * Recursive method that responds to a request and tells Slack when
   * the conversation should continue (convo.ask) or end (convo.say, convo.stop)
   *
   * @param {String} request - text to be processed by Davis
   * @param {Object} convo - conversation object created by botkit
   * @param {Object} bot
   * @param {Object} user
   */
  interact(request, convo, bot, user) {
    const scopeArray = [
      slack.SLACK_REQUEST_SOURCE,
      request.team,
      request.channel,
      request.user,
    ];
    const scope = scopeArray.join(':');
    const chanScope = scopeArray.slice(0,3).join(':');

    if (!this.sharedStorage[chanScope]) {
      this.sharedStorage[chanScope] = {};
    }

    const isTimedOut = moment().subtract(slack.INACTIVITY_TIMEOUT, 'seconds').isAfter(this.sharedStorage[chanScope].lastInteractionTime);

    // Reset last interaction timestamp
    this.sharedStorage[chanScope].lastInteractionTime = moment();

    // do not handle any button clicks
    if (request.callback_id) return;

    this.isDirectMessage = convo.source_message.event === 'direct_message';

    if (convo.sent.length > 0) {
      this.updateListeningStateFooter(convo, bot, true, chanScope);
    } else {
      // new conversation
      this.chanScope = chanScope;
      this.scope = scope;
      if (!this.isDirectMessage) {
        const interval = setInterval(() =>
            this.checkActive(convo, bot, chanScope, interval), 1000);
      }
    }

    // User is initiating a conversation
    if (convo.sent.length === 0) {
      // Strip launch phrase or set to a launch intent compatible phrase
      slack.PHRASES.forEach((phrase) => {
        if (request.text.toLowerCase().includes(phrase)) {
          if (phrase.length === request.text.trim().length) {
            // Only a launch phrase detected, use launch intent compatible phrase
            request.text = 'Start davis';
          } else {
            // Strip launch phrase
            request.text = request.text.toLowerCase().replace(phrase, ''); // Remove phrase
            request.text = request.text.replace(/(^\s*,)|(,\s*$)/g, ''); // Remove leading/trailing white-space and commas
          }
        }
      });
    }

    // if lastInteractionTime is more than 30 seconds ago or other user is mentioned, end conversation
    if ((!this.isDirectMessage && (this.shouldEndSession || isTimedOut)) ||
      this.isOtherUserMentioned(request.text)) {
      this.logger.info('Slack: Conversation stopped');
      convo.stop();
    } else {
      this.askDavis(request, user)
        .then((res) => {
          this.logger.info('Slack: Sending a response');
          let response = res.response.outputSpeech.card;
          this.shouldEndSession = res.response.shouldEndSession;

          if (!response.attachments) response.attachments = [];

          // Move message's text property into the first attachment
          if (response.text) {
            response.attachments.unshift({ text: response.text, fallback: response.text });
            delete response.text;
          }

          if (!this.isDirectMessage) {
            // User davis is talking to added to author field
            response = this.utils.addUsernameAsAuthor(response, user.name);
            response = this.utils.addListeningStateFooter(response, !this.shouldEndSession);
          } else if (response.attachments.length > 1 && response.attachments[response.attachments.length - 2].actions) {
            // Move any buttons in the bottom-most attachment to beneath follow up question in footer
            response.attachments[response.attachments.length - 1].callback_id = response.attachments[response.attachments.length - 2].callback_id;
            response.attachments[response.attachments.length - 1].actions = response.attachments[response.attachments.length - 2].actions;
          }

          response.username = bot.identity.name;
          response.icon_url = bot.identity.icon_url;

          // if no followup question
          if (this.shouldEndSession) {
            convo.say(response);
            convo.next();
          } else {
            // Scope workaround for callbacks
            const self = this;

            // Send response and listen for request
            try {
              convo.ask(response, (req, convo) => {
                if (req) {
                  self.interact(req, convo, bot, user);
                } else {
                  convo.say(slack.ERROR_MESSAGE);
                  convo.next();
                }
              });
              convo.next();
            } catch (err) {
              this.logger.warn(err);
            }
          }
        })
        .catch((err) => {
          this.logger.error('Unable to respond to the request received from Slack');
          this.logger.error(err);
          convo.say(slack.ERROR_MESSAGE);
          convo.next();
        });
    }
  }

  checkActive(convo, bot, chanScope, interval) {
    const timeout = slack.INACTIVITY_TIMEOUT;
    const isTimedOut = moment().subtract(timeout, 'seconds').isAfter(this.sharedStorage[chanScope].lastInteractionTime);

    if (isTimedOut) {
      convo.stop();
    }

    if (!convo.isActive()) {
      this.updateListeningStateFooter(convo, bot, false, chanScope);
      clearInterval(interval);
    }
  }


  /**
   * Updates current message's listening state to sleeping or removes previous message's listening state in footer
   *
   * @param {Object} convo
   * @param {Object} bot
   * @param {Boolean} responded - Set previous message's listening state to Responded if true
   */
  updateListeningStateFooter(convo, bot, responded, chanScope) {
    if (convo.source_message.event === 'direct_message') return;
    // Always modify the most recently sent message
    let message = convo.sent[convo.sent.length - 1];
    let ts = message.api_response.ts;
    const channel = convo.source_message.channel;

    if (this.sharedStorage[chanScope] && this.sharedStorage[chanScope].footer_ts) {
      if (this.sharedStorage[chanScope].footer_ts > ts) {
        ts = this.sharedStorage[chanScope].footer_ts;
      }
    }

    if (this.sharedStorage[chanScope] && this.sharedStorage[chanScope][ts]) {
      message = _.cloneDeep(this.sharedStorage[chanScope][ts]);
      delete this.sharedStorage[chanScope][ts];
    }


    if (message && message.attachments && message.attachments.constructor === String) {
      message.attachments = JSON.parse(message.attachments);
    }

    // Make sure there is at least one attachment
    if (message && (!message.attachments || message.attachments.length === 0)) {
      message.attachments = [{}];
    }

    // Inject footer with listening status of inactive
    message.attachments[message.attachments.length - 1].footer_icon = (responded)
      ? slack.STATES.RESPONDED.ICON
      : slack.STATES.SLEEPING.ICON;
    message.attachments[message.attachments.length - 1].footer = (responded)
      ? slack.STATES.RESPONDED.TEXT
      : slack.STATES.SLEEPING.TEXT;

    const editedMessage = {
      ts,
      text: message.text,
      attachments: message.attachments,
      channel,
      as_user: false,
    };

    bot.api.chat.update(editedMessage, (err, resp) => {
      if (err) this.logger.error(err);

      this.sharedStorage[chanScope][resp.ts] = resp.message;
      if (this.sharedStorage[chanScope].footer_ts < resp.ts) {
        this.sharedStorage[chanScope].footer_ts = resp.ts;
      }
    });
  }

  isOtherUserMentioned(str) {
    const result = (str.includes('@') && !str.includes('davis')) ? str.match(/(?:^|\W)@(\w+)(?!\w)/g) : str;

    if (result !== str) {
      this.logger.warn('Ending conversation, since this other user was mentioned in the request: ');
      this.logger.warn(`"${result}"`);
    }

    return result !== str;
  }

  /**
   * Responds to Slack using the exchange generated by Davis
   * @param {Object} davis - The fully processed Davis object.
   * @returns {Object} response - The response formatted how Slack expects.
   */
  formatResponse(exchange) {
    this.logger.info('Generating the response for Slack');

    let outputSpeech;

    if (exchange.getVisualResponse()) {
      outputSpeech = {
        type: 'card',
        card: exchange.getVisualResponse(),
      };
    } else {
      outputSpeech = {
        type: 'text',
        text: exchange.getTextResponse(),
      };
    }

    return {
      response: {
        shouldEndSession: exchange.shouldConversationEnd(),
        outputSpeech,
      },
    };
  }

  formatErrorResponse(err) {
    let message;
    if (err.name === 'DavisError') {
      message = err.message;
    } else {
      // Adding a generic error message and logging the exception.
      message = 'Unfortunately an unhandled error has occurred.';
      error.logError(err);
    }
    return message;
  }

  /**
   * Strips out emojis
   *
   * @param {String} str
   * @returns {String} result
   */
  stripEmojis(str) {
      // Allow key emoji, so user can ask what our usage of the key means
    let result = (str.includes(':key:')) ? str : str.replace(/:.+:/g, '').trim();

    if (result === '') {
      result = 'hey davis';
      this.logger.warn('Error: Slack stripped emojis and was going to send an empty string to Wit');
    }

    if (result !== str.trim()) {
      this.logger.warn('Emojis stripped from user request: ');
      this.logger.warn(`"${str}"`);
    }

    return result;
  }

  /**
   * Interacts with Davis via Slack
   *
   * @param {Object} req - The request received from Slack.
   * @param {Object} member - Slack member details
   *
   * @returns {promise} res - The response formatted for Slack.
   */
  askDavis(req, member) {
    this.logger.info('Starting our interaction with Davis');
    let intent;
    let button = false;
    const context = {};
    const team = (req.team.constructor === String) ? req.team : req.team.id;
    if (req.callback_id) {
      intent = req.callback_id;
      context.button = req.actions[0];
      button = true;
    }

    // Strip emojis
    req.text = this.stripEmojis(req.text);

    return BbPromise.resolve()
      .then(() => this.users.validateSlackUser(member))
      .then((user) => {
        const scope = `${slack.SLACK_REQUEST_SOURCE}:${team}:${req.channel}:${member.id}`;
        const exchange = new this.Exchange(this.davis, user);
        exchange.isSlackButton = button;
        return exchange.start(req.text, slack.SLACK_REQUEST_SOURCE, scope);
      })
      .then(exchange => exchange.addContext(context))
      .then(exchange => this.pluginManager.run(exchange, intent))
      .then(exchange => this.formatResponse(exchange))
      .catch(err => this.formatErrorResponse(err));
  }
}

module.exports = SlackConversation;
