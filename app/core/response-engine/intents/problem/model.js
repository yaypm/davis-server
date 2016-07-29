'use strict';

const states = require('./states');

module.exports = [
    {'lang': 'en-us', 'tense': 'past',    'problems': 'zero', 'template': 'en-us/tense/past/zero',    "state": states.zeroProblems},
    {'lang': 'en-us', 'tense': 'past',    'problems': 'one',  'template': 'en-us/tense/past/one',     "state": states.oneProblem},
    {'lang': 'en-us', 'tense': 'past',    'problems': 'two',  'template': 'en-us/tense/past/two',     "state": states.twoProblems},
    {'lang': 'en-us', 'tense': 'past',    'problems': 'many', 'template': 'en-us/tense/past/many',    "state": states.manyProblems},
    {'lang': 'en-us', 'tense': 'present', 'problems': 'zero', 'template': 'en-us/tense/present/zero', "state": states.zeroProblems},
    {'lang': 'en-us', 'tense': 'present', 'problems': 'one',  'template': 'en-us/tense/present/one',  "state": states.oneProblem},
    {'lang': 'en-us', 'tense': 'present', 'problems': 'two',  'template': 'en-us/tense/present/two',  "state": states.twoProblems},
    {'lang': 'en-us', 'tense': 'present', 'problems': 'many', 'template': 'en-us/tense/present/many', "state": states.manyProblems},
    {'lang': 'en-us', 'tense': 'future',  'problems': 'zero', 'template': 'en-us/tense/future/zero',  "state": states.zeroProblems},
];