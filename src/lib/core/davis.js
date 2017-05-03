"use strict";

const _ = require("lodash");

const Contexts = require("../controllers/contexts");
const Util = require("../util");
const lex = require("./lex");
const logger = require("./logger");

const { DateProblem, RangeProblem, OpenProblem, LexVersionMismatch } = require("../plugins");

class Davis {
  static getInstance() {
    if (Davis.instance) {
      return Davis.instance;
    }
    Davis.instance = new Davis();
    return Davis.instance;
  }

  constructor() {
    this.plugins = [];
    logger.debug("Loading plugins");
    this.plugins.push(new DateProblem());
    this.plugins.push(new RangeProblem());
    this.plugins.push(new OpenProblem());
    this.plugins.push(new LexVersionMismatch());
    logger.info(`Finished loading ${this.plugins.length} plugins.`);
  }

  async ask(req) {
    const lexResponse = await lex.ask(req.raw, "tempscope");

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

  async formatResponse(res) {
    res.say = res.say || res.text;
    res.show = res.show || { text: res.text };

    res.text = (typeof res.text === "string") ? res.text : await res.text.toString();
    res.say = (typeof res.say === "string") ? res.say : await res.say.audible();
    res.show.text = (typeof res.show.text === "string") ? res.show.text : await res.show.text.toString();
    return res;
  }

  async fulfill(lexResponse, req) {
    const plugin = this.getPlugin(lexResponse.intentName);
    const slots = lexResponse.slots || {};

    if (!plugin) {
      return { text: "That plugin does not exist in Davis right now" };
    }

    const request = await this.createRequest(req, plugin, slots);

    const res = await plugin.run(request);

    return this.formatResponse(res);
  }

  getPlugin(name) {
    return (name) ?
      _.find(this.plugins, { name }) :
      _.find(this.plugins, { name: "lexVersionMismatch" });
  }

  async createRequest(req, plugin, slots) {
    return {
      context: await Contexts.getByScope("user:web:source"),
      intent: plugin.name,
      nlp: {
        timeRange: Util.Date.dateParser(slots.date, req.user),
      },
      raw: req.raw,
      slots: plugin.parseSlots(req.user, slots),
      source: req.source,
      user: req.user,
    };
  }
}

module.exports = Davis.getInstance();
