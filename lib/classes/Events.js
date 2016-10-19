'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class Events extends EventEmitter2 {
  constructor(davis) {
    super({
      wildcard: true,
      delimiter: '::',
      newListener: false,
    });
    this.davis = davis;
  }
}

module.exports = Events;
