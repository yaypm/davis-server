'use strict';

const states = require('./states');

module.exports = [
    {lang: 'en-us', tense: 'past',    problems: 'zero', output: {template: 'en-us/tense/past/zero',    state: states.zeroProblems }},
    {lang: 'en-us', tense: 'past',    problems: 'one',  output: {template: 'en-us/tense/past/one',     state: states.oneProblem }},
    {lang: 'en-us', tense: 'present', problems: 'zero', output: {template: 'en-us/tense/present/zero', state: states.zeroProblems }},
    {lang: 'en-us', tense: 'present', problems: 'one',  output: {template: 'en-us/tense/present/one',  state: states.oneProblem }},
    {lang: 'en-us', tense: 'future',  problems: 'zero', output: {template: 'en-us/tense/future/zero',  state: states.zeroProblems }}
];