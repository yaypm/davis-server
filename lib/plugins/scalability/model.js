'use strict';

module.exports = [
  {
    problems: 0,
    output: {
      template: 'zero',
      followUp: false,
    },
  },
  {
    problems: 1,
    output: {
      template: 'one',
      followUp: true,
      question: 'Would you like me to analyze this further for you?',
    },
  },
  {
    problems: 2,
    output: {
      template: 'two',
      followUp: true,
      question: 'Would you like to know more about the first problem or the second one?',
    },
  },
  {
    problems: 3,
    output: {
      template: 'many',
      followUp: true,
      question: 'Would you be interested in hearing more about the first, second, or third problem?',
    },
  }
];
