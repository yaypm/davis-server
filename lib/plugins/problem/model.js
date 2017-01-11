'use strict';

module.exports = [
  { problems: 0, filtered: false, output: { template: 'zero', followUp: false } },
  { problems: 1, filtered: false, output: { template: 'one', followUp: true, question: 'Would you like me to analyze this further for you?' } },
  { problems: 2, filtered: false, output: { template: 'two', followUp: true, question: 'Would you like to know more about the first problem or the second one?' } },
  { problems: 3, filtered: false, output: { template: 'many', followUp: true, question: 'Would you be interested in hearing more about the first, second, or third problem?' } },
  { problems: 0, filtered: true, output: { template: 'zero', followUp: false } },
  { problems: 1, filtered: true, output: { template: 'one/filtered', followUp: true, question: 'Would you like me to analyze this further for you?' } },
  { problems: 2, filtered: true, output: { template: 'two/filtered', followUp: true, question: 'Would you like to know more about the first problem or the second one?' } },
  { problems: 3, filtered: true, output: { template: 'many/filtered', followUp: true, question: 'Would you be interested in hearing more about the first, second, or third problem?' } },
];
