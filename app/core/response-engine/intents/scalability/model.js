'use strict';

const states = require('./states');

module.exports = [
    {lang: 'en-us', problems: 'zero', output: {template: 'en-us/problems/zero',    state: states.zeroProblems }},
    {lang: 'en-us', problems: 'one',  output: {template: 'en-us/problems/one',     state: states.oneProblem }},
    {lang: 'en-us', problems: 'two',  output: {template: 'en-us/problems/two',     state: states.twoProblems }},
    {lang: 'en-us', problems: 'many', output: {template: 'en-us/problems/many',    state: states.manyProblems }}
];