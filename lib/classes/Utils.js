'use strict';

const BbPromise = require('bluebird');
const fse = BbPromise.promisifyAll(require('fs-extra'));

class Utils {
  constructor(davis) {
    this.davis = davis;
  }

  readFileSync(filePath) {
    let content;

    content = fse.readFileSync(filePath);

    if (filePath.endsWith('.json')) {
      content = JSON.parse(content);
    } else {
      content = content.toString().trim();
    }

    return content;
  }
}

module.exports = Utils;
