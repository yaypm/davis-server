'use strict';

const chalk = require('chalk');
const os = require('os');
const version = require('../../../package.json').version;

const logLevels = ['error', 'warn', 'info', 'debug'];

class Logger {
  constructor(davis, level) {
    this.davis = davis;
    this.level = level;
  }

  enabled() {
    return logLevels.indexOf(this.level) !== -1;
  }

  asciiGreeting() {
    let art = '';
    art = `${art}    ____                    __${os.EOL}`;
    art = `${art}   / __ \\__  ______  ____ _/ /__________  ________${os.EOL}`;
    art = `${art}  / / / / / / / __ \\/ __ \`/ __/ ___/ __ \`/ ___/ _ \\${os.EOL}`;
    art = `${art} / /_/ / /_/ / / / / /_/ / /_/ /__/ /_/ / /__/  __/${os.EOL}`;
    art = `${art}/_____/\\__, /_____/\\__,_/\\__/\\___/\\__,_/\\___/\\___/${os.EOL}`;
    art = `${art}      /____// __ \\____ __   __(_)____${os.EOL}`;
    art = `${art}           / / / / __ \`/ | / / / ___/${os.EOL}`;
    art = `${art}          / /_/ / /_/ /| |/ / (__  )${os.EOL}`;
    art = `${art}         /_____/\\__,_/ |___/_/____/${os.EOL}`;
    this.console(chalk.green(art));
    this.console(' ');
    this.console(chalk.green('  Your Environment Information ----------------------------'));
    this.console(chalk.green(`     OS:                 ${process.platform}`));
    this.console(chalk.green(`     Node Version:       ${process.version.replace(/^[v|V]/, '')}`));
    this.console(chalk.green(`     Davis Version:      ${version}`));
  }

  debug(msg) {
    if (logLevels.indexOf(this.level) >= 3) {
      this.console(chalk.magenta(`DEBUG: ${msg}`));
    }
  }

  info(msg) {
    if (logLevels.indexOf(this.level) >= 2) {
      this.console(chalk.green(`INFO: ${msg}`));
    }
  }

  warn(msg) {
    if (logLevels.indexOf(this.level) >= 1) {
      this.console(chalk.yellow(`WARN: ${msg}`));
    }
  }

  error(msg) {
    if (logLevels.indexOf(this.level) >= 0) {
      this.console(chalk.red(`ERROR: ${msg}`));
    }
  }

  console(msg) {
    if (this.enabled()) {
      console.log(msg); // eslint-disable-line no-console
    }
  }

}

module.exports = Logger;
