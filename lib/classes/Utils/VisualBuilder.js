'use strict';

const moment = require('moment-timezone');
const _ = require('lodash');

const COLORS = {
  OPEN: '#dc172a',
  CLOSED: '#7dc540',
};

class TimeStamp {
  constructor(ts, tz, compact) {
    this.ts = ts || moment().valueOf();
    this.tz = tz || 'Etc/UTC';
    this.compact = Boolean(compact);
  }

  future() {
    return (moment().valueOf() < this.ts);
  }

  // <!date^1392734382^{date_num} {time_secs}|2014-02-18 6:39:42 AM>
  slack() {
    const timezone = this.tz || 'Etc/UTC';
    if (moment.isMoment(this.ts)) return this.slackDate(this.ts.valueOf(), this.tz, this.compact);
    const fallback = moment.tz(this.ts, timezone).calendar();
    return (this.compact) ?
      `<!date^${Math.floor(this.ts / 1000)}^{date_short_pretty} {time}|${fallback}>` :
      `<!date^${Math.floor(this.ts / 1000)}^{date_long_pretty} at {time}|${fallback}>`;
  }
}

class TimeRange {
  constructor(range, tz, compact) {
    this.start = new TimeStamp(range.startTime, tz, compact);
    this.stop = new TimeStamp(range.stopTime || moment().valueOf(), tz, compact);
    this.tz = tz || 'Etc/UTC';
    this.compact = Boolean(compact);
  }

  slack() {
    const start = this.start.slack();
    const stop = (this.stop.future()) ? 'now' : this.stop.slack();
    return (this.compact) ?
      `${start} - ${stop}` :
      `between ${start} and ${stop}`;
  }
}

function slackify(inp) {
  if (inp.constructor === Array) return inp.map(e => slackify(e)).join(' ');
  if (inp.constructor === TimeStamp) return inp.slack();
  if (inp.constructor === TimeRange) return inp.slack();
  return inp.toString();
}

class Card {
  constructor() {
    this.title = [];
    this.link = null;
    this.text = [];
    this.pretext = [];
    this.fallback = [];
    this.fields = [];
    this.color = null;
  }

  addTitle(title) {
    if (title.constructor === Array) {
      title.foreach(e => this.addTitle(e));
      return this;
    }
    this.title.push(title);
    return this;
  }

  addPretext(text) {
    if (text.constructor === Array) {
      text.foreach(e => this.addPretext(e));
      return this;
    }
    this.pretext.push(text);
    return this;
  }

  addText(text) {
    if (text.constructor === Array) {
      text.foreach(e => this.addText(e));
      return this;
    }
    this.text.push(text);
    return this;
  }

  addFallback(fallback) {
    if (fallback.nonstructor === Array) {
      fallback.forEach(e => this.addFallback(e));
      return this;
    }
    this.fallback.push(fallback);
    return this;
  }

  setLink(link) {
    this.link = link;
    return this;
  }

  setColor(color) {
    this.color = _.get(COLORS, color, color);
    return this;
  }

  addField(title, value, short) {
    const field = {};
    if (!_.isNil(title)) field.title = title;
    if (!_.isNil(value)) field.value = value;
    if (!_.isNil(short)) field.short = short;

    this.fields.push(field);
    return this;
  }

  slack() {
    const ret = {
      mrkdwn_in: [
        'text',
        'pretext',
      ],
    };

    if (this.title.length > 0) ret.title = slackify(this.title);
    if (this.text.length > 0) ret.text = slackify(this.text);
    if (this.pretext.length > 0) ret.pretext = slackify(this.pretext);
    if (this.fallback.length > 0) ret.fallback = slackify(this.fallback);

    if (this.fields.length > 0) {
      const fields = this.fields.map((field) => {
        const out = {};
        if (!_.isNil(field.title)) out.title = slackify(field.title);
        if (!_.isNil(field.value)) out.value = slackify(field.value);
        if (!_.isNil(field.short)) out.short = field.short;
        return out;
      });
      ret.fields = fields;
    }

    if (!_.isNil(this.link)) ret.title_link = this.link;
    if (!_.isNil(this.color)) ret.color = this.color;

    return ret;
  }
}

class Message {
  constructor() {
    this.text = [];
    this.fallback = [];
    this.buttonGroup = null;
    this.cards = [];
  }

  addText(text) {
    this.text.push(text);
    return this;
  }

  addFallback(text) {
    this.fallback.push(text);
    return this;
  }

  addCard(card) {
    const type = card.constructor;
    if (type === Array) {
      card.forEach((e) => { this.addCard(e); });
    } else if (type === Card) {
      this.cards.push(card);
    }
    return this;
  }

  setButtons(buttonGroup) {
    this.buttonGroup = buttonGroup;
    return this;
  }

  slack() {
    const ret = { attachments: [] };
    if (this.text.length > 0) ret.text = slackify(this.text);
    if (this.fallback.length > 0) ret.fallback = slackify(this.fallback);
    if (this.cards.length > 0) ret.attachments = this.cards.map(card => card.slack());
    if (!_.isNil(this.buttonGroup)) ret.attachments.push(this.buttonGroup.slack());
    return ret;
  }
}

class ButtonGroup {
  constructor(callbackId) {
    this.callbackId = callbackId;
    this.text = [];
    this.actions = [];
  }

  addAction(name, text, value, type) {
    const button = {
      name,
      text,
      value,
      type: type || 'button',
    };

    this.actions.push(button);
    return this;
  }

  addText(text) {
    if (text.constructor === Array) {
      text.foreach(e => this.addText(e));
      return this;
    }
    this.text.push(text);
    return this;
  }

  slack() {
    return {
      text: slackify(this.text),
      callback_id: this.callbackId,
      actions: this.actions,
    };
  }
}

module.exports = {
  Message,
  Card,
  ButtonGroup,
  TimeStamp,
  TimeRange,
};

