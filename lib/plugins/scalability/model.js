'use strict';

module.exports = [
  {
    tense: 'past',
    problems: 0,
    output: {
      template: 'tense/past/zero',
      followUp: false,
    },
  },
  {
    tense: 'past',
    problems: 1,
    output: {
      template: 'tense/past/one',
      followUp: true,
      question: 'Would you like me to analyze this further for you?',
    },
  },
  {
    tense: 'past',
    problems: 2,
    output: {
      template: 'tense/past/two',
      followUp: true,
      question: 'Would you like to know more about the first problem or the second one?',
    },
  },
  {
    tense: 'past',
    problems: 3,
    output: {
      template: 'tense/past/many',
      followUp: true,
      question: 'Would you be interested in hearing more about the first, second, or third problem?',
    },
  },
  {
    tense: 'present',
    problems: 0,
    output: {
      template: 'tense/present/zero',
      followUp: false,
    },
  },
  {
    tense: 'present',
    problems: 1,
    output: {
      template: 'tense/present/one',
      followUp: true,
      question: 'Would you like me to analyze this further for you?',
    },
  },
  {
    tense: 'present',
    problems: 2,
    output: {
      template: 'tense/present/two',
      followUp: true,
      question: 'Would you like to know more about the first problem or the second one?',
    },
  },
  {
    tense: 'present',
    problems: 3,
    output: {
      template: 'tense/present/many',
      followUp: true,
      question: 'Would you be interested in hearing more about the first, second, or third problem?',
    },
  },
];
