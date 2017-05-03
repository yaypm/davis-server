"use strict";

const bunyan = require("bunyan");
const EOL = require("os").EOL;
const version = require("../../../package.json").version;

class Logger {
  static getInstance() {
    if (!Logger.instance) {
      // Amazing ascii greeting
      let art = "";
      art = `${art}    ____                    __${EOL}`;
      art = `${art}   / __ \\__  ______  ____ _/ /__________  ________${EOL}`;
      art = `${art}  / / / / / / / __ \\/ __ \`/ __/ ___/ __ \`/ ___/ _ \\${EOL}`;
      art = `${art} / /_/ / /_/ / / / / /_/ / /_/ /__/ /_/ / /__/  __/${EOL}`;
      art = `${art}/_____/\\__, /_____/\\__,_/\\__/\\___/\\__,_/\\___/\\___/${EOL}`;
      art = `${art}      /____// __ \\____ __   __(_)____${EOL}`;
      art = `${art}           / / / / __ \`/ | / / / ___/${EOL}`;
      art = `${art}          / /_/ / /_/ /| |/ / (__  )${EOL}`;
      art = `${art}         /_____/\\__,_/ |___/_/____/${EOL}`;
      art = `${art}${EOL}`;
      art = `${art}    Your Environment Information ----------------------------${EOL}`;
      art = `${art}       OS:                 ${process.platform}${EOL}`;
      art = `${art}       Node Version:       ${process.version.replace(/^[v|V]/, "")}${EOL}`;
      art = `${art}       Davis Version:      ${version}${EOL}`;
      art = `${art}       Production:         ${(process.env.NODE_ENV === "production")}`;
      if (!process.env.test) {
        console.log(art); //tslint:disable-line
      }

      // Initializes Bunyan
      Logger.instance = bunyan.createLogger({
        level: process.env.DAVIS_LOG_LEVEL || 0,
        name: this.loggerName,
        serializers: bunyan.stdSerializers,
      });
    }
    return Logger.instance;
  }

}
Logger.loggerName = "davis";
module.exports = Logger.getInstance();
