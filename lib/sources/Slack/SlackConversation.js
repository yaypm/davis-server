'use strict';

const BbPromise = require('bluebird');
const error = require('../../classes/Utils/Error');
const slack = require('../../config/slack');
const moment = require('moment-timezone');


/**
 * Slack conversation
 * Interacts with botkit to allow conversation flow within Slack
 */
class SlackConversation {
  constructor(davis) {
    this.logger = davis.logger;
    this.resetInterval = false;
    this.isDirectMessage = false;
    this.pluginManager = davis.pluginManager;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
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
    // assume all messages coming in are not button clicks
    let button = false;

    if (request.callback_id) { // user clicked a button
      button = true;
      this.removeButtons(bot, convo, request);
      // do not handle buttons marked with the proactive prefix
      if (request.callback_id.startsWith(slack.BUTTON_ID_PREFIX)) return;
    }

    const isTimedOut = moment().subtract(slack.INACTIVITY_TIMEOUT, 'seconds').isAfter(this.lastInteractionTime);
    this.isDirectMessage = convo.source_message.event === 'direct_message';

    // Reset last interaction timestamp
    this.lastInteractionTime = moment();

    if (!this.isDirectMessage && !this.shouldEndSession) {
      // Give the user 30 seconds to respond
      console.log('setting inactivity');
      this.setInactivityInterval(convo, bot);
    }

    if (convo.sent.length > 0 && !button) {
      this.updateListeningStateFooter(convo, bot, true);
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
            response = this.addUsernameAsAuthor(response, user.name);
            response = this.addListeningStateFooter(response, !this.shouldEndSession);
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

  /**
   * Adds the recipient's username to author_name property of message
   *
   * @param {Object} message
   * @param {String} username
   * @return {Object} message
   */
  addUsernameAsAuthor(message, username) {
    message.attachments[0].author_name = `@${username}`;
    return message;
  }

  /**
   * Adds a listening state to the message's footer
   *
   * @param {Object} message - Slack message to be edited
   * @param {Boolean} isListening - Bots listening state
   * @param {Boolean} isNotification - New problem notification
   * @return {Object} message - Edited message
   */
  addListeningStateFooter(message, isListening, isNotification) {
    // Move all pretext property values to text property values if text property isn't already used
    message.attachments.forEach((atm, index) => {
      if (atm.pretext && atm.pretext.length > 0 && (!atm.text || atm.text.trim().length === 0)) {
        message.attachments[index].text = atm.pretext;
        delete message.attachments[index].pretext;
      }
    });

    // Add footer to existing attachment if an image_url doesn't exist
    if (message.attachments.length > 0 && !message.attachments[message.attachments.length - 1].image_url) {
      if (isNotification) {
        message.attachments[message.attachments.length - 1].footer_icon = slack.STATES.NOTIFICATION.ICON;
        message.attachments[message.attachments.length - 1].footer = slack.STATES.NOTIFICATION.TEXT;
      } else {
        message.attachments[message.attachments.length - 1].footer_icon = (isListening) ? slack.STATES.LISTENING.ICON : slack.STATES.SLEEPING.ICON;
        message.attachments[message.attachments.length - 1].footer = (isListening) ? slack.STATES.LISTENING.TEXT : slack.STATES.SLEEPING.TEXT;
      }

    // Add footer to new attachment
    } else if (message.attachments.length > 0) {
      if (isNotification) {
        message.attachments.push({
          text: '',
          footer_icon: slack.STATES.NOTIFICATION.ICON,
          footer: slack.STATES.NOTIFICATION.TEXT,
        });
      } else {
        message.attachments.push({
          text: '',
          footer_icon: (isListening) ? slack.STATES.LISTENING.ICON : slack.STATES.SLEEPING.ICON,
          footer: (isListening) ? slack.STATES.LISTENING.TEXT : slack.STATES.SLEEPING.TEXT,
        });
      }

    // Define attachments and add footer to new attachment
    } else if (isNotification) {
      message.attachments = [{
        footer_icon: slack.STATES.NOTIFICATION.ICON,
        footer: slack.STATES.NOTIFICATION.TEXT,
      }];
    } else {
      message.attachments = [{
        footer_icon: (isListening) ? slack.STATES.LISTENING.ICON : slack.STATES.SLEEPING.ICON,
        footer: (isListening) ? slack.STATES.LISTENING.TEXT : slack.STATES.SLEEPING.TEXT,
      }];
    }

    // Move any buttons in the bottom-most attachment to beneath follow up question in footer
    if (message.attachments.length > 1 && message.attachments[message.attachments.length - 2].actions) {
      message.attachments[message.attachments.length - 1].callback_id = message.attachments[message.attachments.length - 2].callback_id;
      message.attachments[message.attachments.length - 1].actions = message.attachments[message.attachments.length - 2].actions;
    }

    return message;
  }

  removeButtons(bot, convo, message) {
    const action = message.actions[0].name;
    const newMessage = this.davis.utils.Slack.removeButtons(
        message.original_message,
        message.user,
        action);

    const channel = convo.source_message.channel;

    newMessage.channel = channel;

    bot.api.chat.update(newMessage, (err) => {
      if (err) {
        this.logger.error(err);
        throw new Error('Could not update existing Slack message');
      }
    });
  }

  /**
   * Updates current message's listening state to sleeping or removes previous message's listening state in footer
   *
   * @param {Object} convo
   * @param {Object} bot
   * @param {Boolean} responded - Set previous message's listening state to Responded if true
   */
  updateListeningStateFooter(convo, bot, responded) {
    if (convo.source_message.event === 'direct_message') return;
    // Always modify the most recently sent message
    const message = convo.sent[convo.sent.length - 1];
    const channel = convo.source_message.channel;

    // Make sure there is at least one attachment
    if (message && (!message.attachments || message.attachments.length === 0)) {
      message.attachments = [{}];
    }

    // Inject footer with listening status of inactive
    message.attachments[message.attachments.length - 1].footer_icon = (responded) ? slack.STATES.RESPONDED.ICON : slack.STATES.SLEEPING.ICON;
    message.attachments[message.attachments.length - 1].footer = (responded) ? slack.STATES.RESPONDED.TEXT : slack.STATES.SLEEPING.TEXT;

    const editedMessage = {
      ts: message.api_response.ts,
      text: message.text,
      attachments: JSON.stringify(message.attachments),
      channel,
      as_user: false,
    };

    bot.api.chat.update(editedMessage, (err) => {
      if (err) this.logger.error(err);
    });
  }

  /**
   * Alerts the user when they've been inactive
   * for 30 seconds if they're not in direct message mode
   *
   * @param {Object} convo - conversation object created by botkit
   */
  setInactivityInterval(convo, bot) {
    // Inactivity interval message sender
    const inactivityInterval = setInterval(() => {
      // if not a direct message, let the user know they need to wake Davis
      if (!this.isDirectMessage && !this.resetInterval && !this.shouldEndSession) {
        this.updateListeningStateFooter(convo, bot, false);
        clearInterval(inactivityInterval);

        // Allows convo.say to execute beforehand
        setTimeout(() => {
          convo.stop();
        }, 1000);
      } else if (this.shouldEndSession) {
        clearInterval(inactivityInterval);
        convo.stop();
      } else {
        this.resetInterval = false;
      }
    }, slack.INACTIVITY_TIMEOUT * 1000);
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
        const scope = `${slack.SLACK_REQUEST_SOURCE}:${team}:${req.channel}`;
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
