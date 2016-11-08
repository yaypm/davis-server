'use strict';

class Problems {
  constructor(davis, problems) {
    this.logger = davis.logger;

    this.problems = problems;
    this.davis = davis;
  }

  length() {
    return this.problems.length;
  }
}

module.exports = Problems;
