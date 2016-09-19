'use strict';

const states = require('./states');

module.exports = [
    {lang: 'en-us', emoji: null,  output: {template: 'en-us/general',            state: states.help }},
    {lang: 'en-us', emoji: 'key', output: {template: 'en-us/detailed/emoji/key', state: states.help }}
];