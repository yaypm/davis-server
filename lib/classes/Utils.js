'use strict';

const BbPromise = require('bluebird');
const path = require('path');
const fse = BbPromise.promisifyAll(require('fs-extra'));

class Utils {
  constructor(davis) {
    this.davis = davis;
  }

  fileExistsSync(filePath) {
    try {
      const stats = fse.lstatSync(filePath);
      return stats.isFile();
    } catch (e) {
      return false;
    }
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

  findServicePath() {
    let servicePath = null;

    if (this.davis.utils.fileExistsSync(path.join(process.cwd(), 'davis.json'))) {
      servicePath = process.cwd();
    }
    
    return servicePath;
  }
}

module.exports = Utils;
