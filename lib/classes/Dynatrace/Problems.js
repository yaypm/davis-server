'use strict';

class Problems {
  constructor(davis, problems) {
    this.logger = davis.logger;

    this.problems = problems;
    this.davis = davis;
  }

  get(n) {
    return this.problems[n];
  }

  length() {
    return this.problems.length;
  }
}

module.exports = Problems;
