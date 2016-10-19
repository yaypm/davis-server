'use strict';

const natural = require('natural');
const rp = require('request-promise');

class Nlp {

  constructor(options) {
    // {
    //  stemmer: natural.PorterStemmer,
    //  keepStops: true,
    //  classifier: new natural.LogisticRegressionClassifier(),
    //  threshold: 0.8,
    //  uri: 'https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com/prod/datetime',
    //  timezone: 'Etc/UTC',
    //  apps: []
    // }


    // const options = options || {};
    this.stemmer = options.stemmer || natural.PorterStemmer;
    this.keepStops = options.keepStops || true;
    this.classifier = options.classifier || new natural.LogisticRegressionClassifier();
    this.threshold = options.threshold || 0.8;
    this.uri = options.uri || 'https://ogj1j3zad0.execute-api.us-east-1.amazonaws.com/prod/datetime';
    this.timezone = options.timezone || 'Etc/UTC';
    this.apps = options.apps || [];


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
    for (const i in this.apps) {
      const obj = this.apps[i];
        // console.log(i, obj)
      const app = obj.name;
      for (const j in obj.variants) {
        const variant = obj.variants[j];
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
      }
    }
    return {
      stripped: text,
    };
  }

  stripDateTimes(text) {
    const options = {
      method: 'POST',
      uri: this.uri,
      body: { expression: text, timezone: 'America/Detroit' },
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

  strip(text) {
    const app = this.stripApp(text);
    // console.log(app);
    return this.stripDateTimes(app.stripped)
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

  classify(text) {
    return this.strip(text)
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
