'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Nunjucks = require('./Nunjucks');

const NUNJUCK_EXTENSION = '.nj';
const RESERVED_FOLDER_NAMES = {
  say: ['audible', 'say'],
  show: ['visual', 'show'],
};

class ResponseBuilder {
  constructor(davis) {
    this.logger = davis.logger;

    // this.greeter = new Greeter(davis);
    this.nunjucks = new Nunjucks(davis);
    this.davis = davis;
  }

  randomNunjuckTemplate(templatePath, files) {
    const filteredTemplateList = _.filter(files, file => _.endsWith(file, NUNJUCK_EXTENSION));

    if (filteredTemplateList.length === 0) {
      this.logger.error('Unable to find a template');
      return new this.davis.Error('Unable to find template.');
    }
    return path.join(templatePath, _.sample(filteredTemplateList));
  }

  findAdditionalTemplates(templatePath, files, reservedFolders) {
    const matches = _.intersection(files, reservedFolders);
    if (_.isEmpty(matches)) return null;

    const folder = _.head(matches);

    const newFiles = fs.readdirSync(templatePath);
    if (files.length === 0) {
      this.logger.warn(`Template directory exists, but is empty: ${templatePath}/${matches[0]}`);
      return null;
    }

    return this.randomNunjuckTemplate(templatePath, folder, newFiles);
  }

  createSlackCard(text) {
    return { text };
  }

  getTemplates(templateDir) {
    try {
      const files = fs.readdirSync(path.normalize(templateDir));

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

  build(exchange) {
    // TODO
    const templates = exchange.getTemplates();
    try {
      const response = _.mapValues(templates, template =>
        this.nunjucks.render(template, exchange.getContext())
      );

      try {
        response.show = (response.show) ? JSON.parse(response.show) : { text: response.text };
      } catch (err) {
        this.logger.warn("The show response wasn't valid JSON. Processing as text.");
        response.show = this.createSlackCard(text);
      }

      return response;
    } catch (err) {
      this.logger.error(`Unable to get templates: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ResponseBuilder;
