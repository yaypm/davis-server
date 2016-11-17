'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Nunjucks = require('./Nunjucks');
const Greeter = require('./Greeter');
const REPLACEMENTS = require('./replacements');

const NUNJUCK_EXTENSION = '.nj';
const RESERVED_FOLDER_NAMES = {
  say: ['audible', 'say'],
  show: ['visual', 'show'],
};

class ResponseBuilder {
  constructor(davis) {
    this.logger = davis.logger;

    this.greeter = new Greeter(davis);
    this.nunjucks = new Nunjucks(davis);
    this.davis = davis;
  }

  randomNunjuckTemplate(templatePath, files) {
    const filteredTemplateList = _.filter(files, file => _.endsWith(file, NUNJUCK_EXTENSION));

    if (filteredTemplateList.length === 0) {
      return null;
    }
    return path.join(templatePath, _.sample(filteredTemplateList));
  }

  findAdditionalTemplates(templatePath, files, reservedFolders) {
    const matches = _.intersection(files, reservedFolders);
    if (_.isEmpty(matches)) return null;

    const folder = _.head(matches);

    const newPath = path.join(templatePath, folder);

    const newFiles = fs.readdirSync(newPath);
    if (newFiles.length === 0) {
      this.logger.warn(`Template directory exists, but is empty: ${templatePath}/${matches[0]}`);
      return null;
    }

    return this.randomNunjuckTemplate(newPath, newFiles);
  }

  createSlackCard(text) {
    return { text };
  }

  getTemplates(plugin, tagDir) {
    try {
      const dir = (_.isString(tagDir)) ? tagDir : '';
      const templateDir = path.join(plugin.dir, 'templates', dir);
      const files = fs.readdirSync(templateDir);

      const templates = _.omitBy({
        sayPath: this.findAdditionalTemplates(templateDir, files, RESERVED_FOLDER_NAMES.say),
        textPath: this.randomNunjuckTemplate(templateDir, files),
        showPath: this.findAdditionalTemplates(templateDir, files, RESERVED_FOLDER_NAMES.show),
      }, _.isNil);

      return templates;
    } catch (err) {
      this.davis.logger.error(`Unable to get templates: ${err.message}`);
      throw err;
    }
  }

  interpret(str, rep) {
    let out = str;

    const search = rep[0];
    let replace = rep[1];
    // console.log(typeof(search));
    if (_.isNil(replace) && typeof search === 'string') {
      replace = `<say-as interpret-as="spell-out">${search}</say-as>`;
    }

    if (typeof (rep[0]) === 'string') {
      const s = new RegExp(`\\b${search}\\b`, 'gi');
      out = out.replace(s, replace);
    } else if (search instanceof RegExp) {
      out = out.replace(new RegExp(search.source, 'gi'), replace);
    }

    return out;
  }

  pronounceable(str) {
    let build = str;
    _.forEach(REPLACEMENTS, rep => {
      const reSsml = /<say-as.*?<\/say-as>/gi;
      const nonSsml = build.split(reSsml);
      const ssml = build.match(reSsml) || [];
      ssml.push('');
      const out = [];
      for (let i = 0; i < ssml.length; i++) {
        const p = this.interpret(nonSsml[i], rep);
        const s = ssml[i];
        out.push(p + s);
      }
      build = out.join('');
    });
    return build;
  }

  build(exchange) {
    const out = {};
    let dir;
    const context = exchange.getTemplateContext();
    /*
    {
      text, say, show, textString, sayString, showString, textPath, sayPath, showPath
    }
    */
    const response = exchange.getRawResponse();

    try {
      if (_.has(response, 'string.text')) {
        out.text = response.string.text;
      } else if (_.has(response, 'templateString.text')) {
        out.text = this.nunjucks.renderString(response.templateString.text, context);
      } else if (_.has(response, 'templatePath.text')) {
        dir = path.join(this.davis.dir, response.templatePath.text);
        out.text = this.nunjucks.render(dir, context);
      } else {
        this.logger.debug('response has no text component');
      }

      if (_.has(response, 'string.say')) {
        out.say = response.string.say;
      } else if (_.has(response, 'templateString.say')) {
        out.say = this.nunjucks.renderString(response.templateString.say, context);
      } else if (_.has(response, 'templatePath.say')) {
        dir = path.join(this.davis.dir, response.templatePath.say);
        out.say = this.nunjucks.render(dir, context);
      } else {
        this.logger.debug('response has no say component');
      }

      if (_.has(response, 'string.show')) {
        out.show = response.string.show;
      } else if (_.has(response, 'templateString.show')) {
        out.show = this.nunjucks.renderString(response.templateString.show, context);
      } else if (_.has(response, 'templatePath.show')) {
        dir = path.join(this.davis.dir, response.templatePath.show);
        out.show = this.nunjucks.render(dir, context);
      } else {
        this.logger.debug('response has no show component');
      }

      if (!_.isNil(out.show) && _.isString(out.show)) {
        try {
          out.show = JSON.parse(out.show);
        } catch (err) {
          this.davis.logger.debug('show card is not valid JSON, treating as raw text');
          out.show = { text: out.show };
        }
      }

      if (_.keys(out).length === 0) {
        throw new this.davis.classes.Error('Must set a response');
      }

      let base = out.text || out.say || out.show.text;
      base = base.split(/\s+/).join(' ');

      if (!_.has(out, 'text')) out.text = base;
      if (!_.has(out, 'say')) out.say = base;
      if (!_.has(out, 'show')) out.show = this.createSlackCard(base);
      if (!_.has(out.show, 'attachments')) out.show.attachments = [];

      if (exchange.shouldGreet()) {
        const greeting = this.greeter.greet(exchange);
        if (!_.isNil(greeting)) {
          out.text = `${greeting}  ${out.text}`;
          out.say = `${greeting}  ${out.say}`;
          out.show.text = `${greeting}  ${out.show.text}`;
        }
      }

      if (!exchange.shouldConversationEnd() && exchange.shouldFollowUp()) {
        const followUp = exchange.getFollowUpQuestion() || _.sample([
          'What else can I do for you?',
          'Is there anything else I can help you with?',
          'Is there anything else you need?',
          'What else can I help you with?',
        ]);

        out.text = `${out.text}  ${followUp}`;
        out.say = `${out.say}  ${followUp}`;

        if (out.show.attachments.length === 0) {
          out.show.text = `${out.show.text}  ${followUp}`;
        } else {
          out.show.attachments.push({ text: followUp });
        }
      }

      out.say = out.say.split(/\s+/).join(' ');

      out.say = this.pronounceable(out.say);
      exchange.setResponse(out);
      return out;
    } catch (err) {
      this.logger.error(`Unable to get templates: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ResponseBuilder;
