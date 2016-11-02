'use strict';

const natural = require('natural');
const rp = require('request-promise');
const _ = require('lodash');

/**
 * Natural Language Processor
 * @constructor
 */
class Nlp {
  /**
   * Creates an instance of Nlp.
   *
   * @param {Object} options
   * @param {string} options.stemmer ['natural.PorterStemmer'] - The natural stemmer to use.
   * @param {boolean} options.keepStops [true]
   * @param {Object} options.classifier [new natural.LogisticRegressionClassifier()] - The natural classifer to use.
   * @param {number} options.threshold [0.8] - The confidence level the classifer should achieve.
   * @param {string} options.url ['https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com/prod/datetime'] - The URI to the hosted datetime parser.
   * @param {string} options.timezone ['Etc/UTC'] - The timezone that should be used when parsing the datetime.
   * @param {Array} options.apps - An array of application names that could be parsed out.
   *
   * @memberOf Nlp
   */
  constructor(pluginManager, options) {
    const configObject = options || {};
    this.pluginManager = pluginManager;
    this.stemmer = configObject.stemmer || natural.PorterStemmer;
    this.keepStops = configObject.keepStops || true;
    this.classifier = configObject.classifier || new natural.LogisticRegressionClassifier();
    this.threshold = configObject.threshold || 0.8;
    this.uri = configObject.uri || 'https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com/prod/datetime';
    this.timezone = configObject.timezone || 'Etc/UTC';
    this.apps = configObject.apps || [];

    this.classifier.stemmer = this.stemmer;
    this.rawData = {};
  }

  /**
   * Add an app to NLP
   *
   * @param {Object} obj
   * @param {String} obj.name - The name of the app
   * @param {Array} obj.variants - Other names the app may be called
   *
   * @memberOf Nlp
   */
  addApp(obj) {
    const variants = obj.variants || [];
    variants.push(obj.name);
    this.apps.push({
      name: obj.name,
      variants,
    });
  }

  /**
   * Strip app entities from text
   *
   * @param {String} text - Text to be stripped
   *
   * @returns {App}
   * @memberOf Nlp
   */
  stripApp(text) {
    let r = { stripped: text };
    this.apps.map((obj) => {
      const app = obj.name;
      obj.variants.map((variant) => {
        const n = variant.length;
        const idx = text.toLowerCase().indexOf(variant.toLowerCase());
        if (idx >= 0) {
          const stripped = `${text.substr(0, idx)}{{APP}}${text.substr(idx + n)}`;
          r = {
            _text: text,
            body: text.substr(idx, n),
            app,
            start: idx,
            end: idx + n,
            stripped,
          };
        }
        return undefined;
      });
      return undefined;
    });
    return r;
  }

  /**
   * Strip a datetime entity from an expression with respect to a timezone
   *
   * @param {String} expression - The expression a datetime object is to be stripped from
   * @param {String} tz - The timezone to use as the current timezone
   *
   * @returns {StrippedDatetime}
   *
   * @memberOf Nlp
   */
  stripDateTimes(expression, tz) {
    const timezone = tz || this.timezone;
    const options = {
      method: 'POST',
      uri: this.uri,
      body: { expression, timezone },
      json: true,
    };
    return rp(options)
      .then((parsedBody) => {
        let res = parsedBody._text;
        const latent = parsedBody.latent;
        const body = parsedBody.body;
        if (_.isNil(parsedBody.body)) {
          return { stripped: undefined, value: undefined };
        }
        if (!latent) {
          res = res.replace(body, '{{DATETIME}}');
        }
        return ({
          stripped: res,
          value: parsedBody,
        });
      }).catch((err) => {
        this.pluginManager.davis.logger.error('Datetime Extraction Failed');
        this.pluginManager.davis.logger.error(err);
      });
  }

  /**
   * Strip app and datetime from an expression with respec to a timezone
   *
   * @param {String} text - The input text to be stripped
   * @param {String} tz - The timezone
   *
   * @memberOf Nlp
   */
  strip(text, tz) {
    const app = this.stripApp(text);
    return this.stripDateTimes(app.stripped, tz)
      .then((res) => {
        const ret = {
          text,
          stripped: _.get(res, 'stripped', text),
          app,
          datetime: res,
        };
        return ret;
      })
      .catch((err) => {
        this.pluginManager.davis.logger.error(err);
      });
  }

  stripAndAddDocument(text, intent) {
    return this.strip(text)
      .then((res) => {
        const stems = this.tokenizeAndStem(res.stripped, this.keepStops);
        this.classifier.addDocument(stems, intent);
        this.rawData[text] = { stripped: res.stripped, stems, intent };
      });
  }

  addDocument(stripped, intent) {
    const stems = this.tokenizeAndStem(stripped, this.keepStops);
    this.classifier.addDocument(stems, intent);
    this.rawData[stripped] = { stripped, stems, intent };
  }

  addDocuments(expressions, intent) {
    expressions.map(exp => this.addDocument(exp, intent));
  }

  tokenizeAndStem(text) {
    const t = new natural.RegexpTokenizer({ pattern: /[^A-Za-zА-Яа-я0-9_{}]+/ });
    const tokens = t.tokenize(text);
    const stems = tokens.map(this.stemmer.stem);
    return stems;
  }

  train() {
    this.classifier.train();
  }

  hotStart() {
    const options = {
      method: 'POST',
      uri: this.uri,
      body: { expression: 'hot start now', timezone: 'Etc/UTC' },
      json: true,
    };
    return rp(options);
  }

  /**
   * Strip and classify an exchange object
   *
   * @param {Object} exchange - A DAVIS exchange object
   *
   * @return {NlpData}
   *
   * @memberOf Nlp
   */
  classify(exchange) {
    const text = exchange.getRawRequest();
    const tz = exchange.getTimezone() || 'Etc/UTC';
    return this.strip(text, tz)
      .then((res) => {
        const stems = this.tokenizeAndStem(res.stripped);
        const probs = this.classifier.getClassifications(stems);
        let intent = probs[0].label;
        if (probs[0].value < this.threshold) intent = 'unknown';
        return {
          text,
          intent,
          probabilities: _.take(probs, 3),
          stripped: _.get(res, 'stripped'),
          datetime: _.get(res, 'datetime.value'),
          app: res.app,
        };
      });
  }

  /**
   * @typedef {Object} App
   * @property {String} _text - The original text
   * @property {String} body - The body of the stripped app text
   * @property {String} app - App name
   * @property {number} start - The start index of the body in the original text
   * @property {number} end - The end index of the body in the original text
   * @property {String} stripped - The text with the App stripped out
   * @memberOf Nlp
   */

  /**
   *
   * @typedef {Object} NlpData
   * @property {String} text
   * @property {String} intent
   * @property {Array} probabilities
   * @property {String} stripped
   * @property {Datetime} datetime
   * @property {App} app
   * @memberOf Nlp
   */

  /**
   * @typedef {Object} Datetime
   * @property {String} _text - The original text
   * @property {String} body - The body of the stripped datetime
   * @property {number} start - The start index of the body in the original text
   * @property {number} end - The end index of the body in the original text
   * @property {boolean} latent - Is this a latent datetime
   * @property {Object} entities - Object holding the datetime value
   * @memberOf Nlp
   */

  /**
   * @typedef {Object} StrippedDatetime
   * @property {String} stripped - The text with the body stripped out
   * @property {Datetime} value - The datetime entity
   * @memberOf Nlp
   */
}

module.exports = Nlp;
