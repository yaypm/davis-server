'use strict';

const natural = require('natural');
const rp = require('request-promise');

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
  constructor(davis, options) {
    const configObject = options || {};
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

  addApp(obj) {
    // {
    //  name: "Easy Travel",
    //  variants: [
    //      "easytravel"
    //  ]
    // }
    const variants = obj.variants || [];
    variants.push(obj.name);
    this.apps.push({
      name: obj.name,
      variants,
    });
  }

  stripApp(text) {
    // possibly for some future changes
    // http://ginstrom.com/scribbles/2007/12/01/fuzzy-substring-matching-with-levenshtein-distance-in-python/
    // for (const i in this.apps) {
    this.apps.map(obj => {
      // const obj = this.apps[i];
        // console.log(i, obj)
      const app = obj.name;
      // for (const j in obj.variants) {
      obj.variants.map(variant => {
        // const variant = obj.variants[j];
        const n = variant.length;
        const idx = text.toLowerCase().indexOf(variant.toLowerCase());
        if (idx >= 0) {
          const stripped = `${text.substr(0, idx)}{{APP}}${text.substr(idx + n)}`;
          return {
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
    return {
      stripped: text,
    };
  }

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
        if (!latent) {
          res = res.replace(body, '{{DATETIME}}');
        }
        return ({
          stripped: res,
          value: parsedBody,
        });
      }).catch((err) => {
        console.log('Datetime Extraction Failed');
        console.log(err);
      });
  }

  strip(text, tz) {
    const app = this.stripApp(text);
    // console.log(app);
    return this.stripDateTimes(app.stripped, tz)
    .then((res) => {
      const ret = {
        text,
        stripped: res.stripped,
        app,
        datetime: res,
      };
      return ret;
    }).catch((err) => {
      console.log(err);
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
    for (const i in expressions) {
      const exp = expressions[i];
      this.addDocument(exp, intent);
    }
  }

  tokenizeAndStem(text) {
    const t = new natural.RegexpTokenizer({ pattern: /[^A-Za-zА-Яа-я0-9_{}]+/ });
    const tokens = t.tokenize(text);
    const stems = tokens.map(this.stemmer.stem);
    // console.log(stems)
    return stems;
    // return this.stemmer.tokenizeAndStem(text, this.keepStops);
  }

  train() {
    this.classifier.train();
  }

  classify(text, tz) {
    return this.strip(text, tz)
    .then((res) => {
      const stems = this.tokenizeAndStem(res.stripped);
      const probs = this.classifier.getClassifications(stems);
      let intent = probs[0].label;
      if (probs[0].value < this.threshold) intent = 'unknown';
      return {
        text,
        intent,
        probabilities: probs,
        stripped: res.stripped,
        datetime: res.datetime.value,
        app: res.app,
      };
    });
  }

  getClassifications(text) {
    const stems = this.tokenizeAndStem(text);
    return this.classifier.getClassifications(stems);
  }
}

module.exports = Nlp;
