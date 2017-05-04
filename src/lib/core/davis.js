"use strict";

const Contexts = require("../controllers/contexts");
const Util = require("../util");
const lex = require("./lex");
const logger = require("./logger");
const _ = require("lodash");

const plugins = require("../plugins");

class Davis {
  /**
   * Get singleton instance
   *
   * @static
   * @returns
   *
   * @memberOf Davis
   */
  static getInstance() {
    if (Davis.instance) {
      return Davis.instance;
    }
    Davis.instance = new Davis();
    return Davis.instance;
  }

  /**
   * Creates an instance of Davis. Loads plugins
   *
   *
   * @memberOf Davis
   */
  constructor() {
    this.plugins = {};
    logger.debug("Loading plugins");
    plugins.forEach((Plug) => {
      const plug = new Plug(this);
      this.plugins[plug.name] = plug;
    });
    logger.info(`Loaded ${Object.keys(this.plugins).length} plugins.`);
  }

  /**
   * Ask davis a question
   *
   * @param {IRawRequest} req
   * @returns {Promise<IDavisResponse>}
   *
   * @memberOf Davis
   */
  async ask(req) {
    const lexResponse = await lex.ask(req.raw, req.scope);

    if (lexResponse.dialogState === "ReadyForFulfillment") {
      return this.fulfill(lexResponse, req);
    }

    if (lexResponse.dialogState === "Failed") {
      return {
        text: "I'm sorry, but I'm having trouble understanding what you mean.",
      };
    }

    return {
      text: lexResponse.message || "I could not figure out what you were trying to say here",
    };
  }

  /**
   * Fill in the missing pieces of {say, show, text}
   *
   * @param {IDavisResponse} res
   * @returns {Promise<IDavisResponse>}
   *
   * @memberOf Davis
   */
  async formatResponse(res) {
    const out = { text: res.text };
    out.say = res.say || res.text;
    out.show = res.show || { text: res.text };

    out.text = (typeof out.text === "string") ? out.text : await out.text.toString();
    out.say = (typeof out.say === "string") ? out.say : await out.say.audible();
    out.show.text = (typeof out.show.text === "string") ? out.show.text : await out.show.text.toString();
    return out;
  }

  /**
   * Fulfill an intent
   *
   * @param {LexRuntime.PostTextResponse} lexResponse
   * @param {IRawRequest} req
   * @returns {Promise<IDavisResponse>}
   *
   * @memberOf Davis
   */
  async fulfill(lexResponse, req) {
    logger.debug(`Lex found ${lexResponse.intentName}`);
    const plugin = this.plugins[lexResponse.intentName] || this.plugins.lexVersionMismatch;
    const slots = lexResponse.slots || {};

    if (!plugin) {
      return { text: "That plugin does not exist in Davis right now" };
    }

    const request = await this.createRequest(req, plugin, slots);

    const res = await plugin.run(request);

    request.context.intentHistory.push(res.intent);
    if (res.targets) {
      _.assign(request.context.targets, res.targets);
    }
    await request.context.save();

    return this.formatResponse(res);
  }

  /**
   * Build a Davis Request from a Raw Request
   *
   * @param {IRawRequest} req
   * @param {Plugin} plugin
   * @param {ISlots} slots
   * @returns {IDavisRequest}
   *
   * @memberOf Davis
   */
  async createRequest(req, plugin, slots) {
    return {
      context: await Contexts.getByScope(req.scope),
      intent: plugin.name,
      nlp: {
        timeRange: Util.Date.dateParser(slots.date, req.user),
      },
      raw: req.raw,
      slots: plugin.parseSlots(req.user, slots),
      scope: req.scope,
      user: req.user,
    };
  }
}

module.exports = Davis.getInstance();
