'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const Decide = require('./Decide');

const ConversationModel = require('../../models/Conversation');
const ExchangeModel = require('../../models/Exchange');

class Exchange {
  /**
   * Creates an instance of Exchange.
   *
   * @param {Object} davis
   * @param {Object} user
   * @param {string} user.id - A unique ID for the user.
   * @param {string} user.email - The email address of the user.
   * @param {string} user.name.first - The first name of the user.
   * @param {string} user.name.last - The last name of the user.
   * @param {string} user.timezone - The canonical timezone of the user.
   *
   * @memberOf Exchange
   */
  constructor(davis, user) {
    this.logger = davis.logger;
    this.user = user;

    this._shouldGreet = false;
    this._shouldFollowUp = true;
    this.templateContext = {};
    this.rawResponse = {};
    this.rawResponse.string = {};
    this.rawResponse.templatePath = {};
    this.rawResponse.templateString = {};
    this.question = '';
    this.decide = new Decide(davis);

    this.davis = davis;
  }

  /**
   * Starts a new exchange
   *
   * @param {string} request - The request from the user.
   * @param {string} source - The source of the user request.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  start(request, source) {
    return BbPromise.try(() => {
      if (!request) throw new this.davis.classes.Error('A user request is required!');
      if (!source) throw new this.davis.classes.Error('A source is required!');
      this.logger.info(`Starting a new exchange from ${source}: '${request}'`)
    }).bind(this)
      .then(() => ConversationModel.findOne({ userId: this.user.id }))
      .then(this.getConversation)
      .then(this.getConversationHistory)
      .then((conversation) => {
        this.model = new ExchangeModel({
          _conversation: conversation.id,
          source,
          request: {
            raw: request.trim(),
          },
          conversationContext: this.conversationContext,
        });
        return this;
      });
  }

  /**
   * Tells the response builder to include a greeting
   *
   * @returns {Object} this
   *
   * @memberOf Exchange
   */
  greet() {
    this._shouldGreet = true;
    return this;
  }

  addTemplateContext(templateContext) {
    _.merge(this.templateContext, templateContext);
    return this;
  }

  getTemplateContext() {
    return _.merge({}, this.templateContext, { user: this.user, timeRange: this.getTimeRange() });
  }

  /**
   *  The response that should be processed and sent to the user.
   *
   * @param {(string|Object)} response
   * @param {string} response.text
   * @param {string} response.say
   * @param {string} response.show
   * @param {string} response.textPath
   * @param {string} response.sayPath
   * @param {string} response.showPath
   * @param {string} response.textString
   * @param {string} response.sayString
   * @param {string} response.showString
   *
   * @memberOf Exchange
   */
  response(response) {
    if (_.isNil(response)) {
      throw new this.davis.classes.Error('No response was provided by the intent.');
    } else if (_.isString(response)) {
      // Text response
      if (response.length === 0) {
        throw new this.davis.classes.Error('Unable to use an empty string.');
      }
      this.rawResponse.string.text = response;
    } else {
      if (_.has(response, 'text')) this.rawResponse.string.text = response.text;
      if (_.has(response, 'say')) this.rawResponse.string.say = response.say;
      if (_.has(response, 'show')) this.rawResponse.string.show = response.show;
      if (_.has(response, 'textPath')) this.rawResponse.templatePath.text = response.textPath;
      if (_.has(response, 'sayPath')) this.rawResponse.templatePath.say = response.sayPath;
      if (_.has(response, 'showPath')) this.rawResponse.templatePath.show = response.showPath;
      if (_.has(response, 'textString')) this.rawResponse.templateString.text = response.textString;
      if (_.has(response, 'sayString')) this.rawResponse.templateString.say = response.sayString;
      if (_.has(response, 'showString')) this.rawResponse.templateString.show = response.showString;
    }
    return this;
  }

  /**
   * Ask a follow up question
   *
   * @param {String} question
   *
   * @memberOf Exchange
   */
  followUp(question) {
    this.question = question;
    return this;
  }

  skipFollowUp() {
    this._shouldFollowUp = false;
    return this;
  }

  /**
   * Get the current follow up question
   *
   * @returns {String}
   * @memberOf Exchange
   */
  getFollowUpQuestion() {
    return this.question;
  }

  /**
   * Ends the conversation if this is the first exchange
   *
   * @returns {Object} this
   *
   * @memberOf Exchange
   */
  smartEnd() {
    this.model.response.finished = this.history.newConversation;
    return this;
  }

  /**
   * Ends the current conversation
   *
   * @returns {Object} this
   *
   * @memberOf Exchange
   */
  end() {
    this.model.response.finished = true;
    return this;
  }

  /**
   * Saves the current exchange to MongoDB
   *
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  save() {
    return this.model.save().then(() => this);
  }

  /**
   * Creates or reuses a conversation
   *
   * @param {Object} conversation - The conversation object from MongoDB.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  getConversation(conversation) {
    return BbPromise.resolve()
      .then(() => {
        if (_.isNull(conversation)) {
          this.logger.info('We\'re never talked to this user before.  Starting a new conversation');
          const conversationModel = new ConversationModel({ userId: this.user.id });
          return conversationModel.save();
        }
        return conversation;
      });
  }

  /**
   * Gathers the users history based on prior exchanges
   *
   * @param {Object} conversation - The conversation object from MongoDB.
   * @returns {Promise}
   *
   * @memberOf Exchange
   */
  getConversationHistory(conversation) {
    return BbPromise.resolve()
      .then(() => ExchangeModel
        .find({ _conversation: conversation.id })
        .limit(10)
        .sort({ updatedAt: -1 })
        .exec())
      .then((history) => {
        if (history.length === 0) {
          this.conversationContext = {};
        } else {
          this.conversationContext = history[0].conversationContext;
        }
        this.history = {
          firstInteraction: (history.length === 0),
          newConversation: (history.length === 0 || _.get(history, '[0].response.finished') === true),
          lastInteraction: _.get(history, '[0]'),
        };
        return conversation;
      });
  }

  getConversationContext() {
    if (_.isNil(this.model.conversationContext)) {
      this.model.conversationContext = {};
    }
    return this.model.conversationContext;
  }

  addConversationContext(obj) {
    if (_.isNil(this.model.conversationContext)) {
      this.model.conversationContext = {};
    }
    _.merge(this.model.conversationContext, obj);
    return this;
  }

  resetConversationContext() {
    this.model.conversationContext = {};
    return this;
  }

  setConversationContextProperty(prop, value) {
    if (_.isNil(this.model.conversationContext)) {
      this.model.conversationContext = {};
    }
    this.model.conversationContext[prop] = value;
    return this;
  }

  isFirstInteraction() {
    return this.history.firstInteraction;
  }

  /**
   * Adds the processed response from Davis NLP
   *
   * @param {Object} data - Processed user request.
   * @returns {Object} this
   *
   * @memberOf Exchange
   */
  addNlpData(data) {
    this.model.request.analysed = data;
    return this;
  }

  getNlpData() {
    return this.model.request.analysed;
  }

  getTimeRange() {
    return _.get(this, 'model.request.analysed.timeRange');
  }

  say(text) {
    this.model.response.audible.ssml = text;
    return this;
  }

  getAudibleResponse() {
    return _.get(this, 'model.response.audible.ssml');
  }

  show(card) {
    this.model.response.visual.card = card;
    return this;
  }

  getRawResponse() {
    return this.rawResponse;
  }

  setResponse(response) {
    this.model.response.audible.ssml = response.say;
    this.model.response.visual.text = response.text;
    this.model.response.visual.card = response.show;
  }

  getTextResponse() {
    return _.get(this, 'model.response.visual.text');
  }

  getVisualResponse() {
    return _.get(this, 'model.response.visual.card');
  }

  shouldConversationEnd() {
    return this.model.response.finished;
  }

  shouldFollowUp() {
    return this._shouldFollowUp;
  }

  shouldGreet() {
    return this._shouldGreet;
  }

  getRawRequest() {
    return this.model.request.raw;
  }

  getTimezone() {
    return this.user.timezone;
  }

  getRequestSource() {
    return this.model.source;
  }

}

module.exports = Exchange;
