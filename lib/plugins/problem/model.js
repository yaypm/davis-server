'use strict';

module.exports = [
  { tense: 'past', problems: 0, filtered: false, output: { template: 'zero', followUp: false } },
  { tense: 'past', problems: 1, filtered: false, output: { template: 'one', followUp: true, question: 'Would you like me to analyze this further for you?' } },
  { tense: 'past', problems: 2, filtered: false, output: { template: 'two', followUp: true, question: 'Would you like to know more about the first problem or the second one?' } },
  { tense: 'past', problems: 3, filtered: false, output: { template: 'many', followUp: true, question: 'Would you be interested in hearing more about the first, second, or third problem?' } },
  { tense: 'future', problems: 0, filtered: false, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 1, filtered: false, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 2, filtered: false, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 3, filtered: false, output: { template: 'future', followUp: false } },
  { tense: 'past', problems: 0, filtered: true, output: { template: 'zero', followUp: false } },
  { tense: 'past', problems: 1, filtered: true, output: { template: 'one/filtered', followUp: true, question: 'Would you like me to analyze this further for you?' } },
  { tense: 'past', problems: 2, filtered: true, output: { template: 'two/filtered', followUp: true, question: 'Would you like to know more about the first problem or the second one?' } },
  { tense: 'past', problems: 3, filtered: true, output: { template: 'many/filtered', followUp: true, question: 'Would you be interested in hearing more about the first, second, or third problem?' } },
  { tense: 'future', problems: 0, filtered: true, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 1, filtered: true, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 2, filtered: true, output: { template: 'future', followUp: false } },
  { tense: 'future', problems: 3, filtered: true, output: { template: 'future', followUp: false } },
];
