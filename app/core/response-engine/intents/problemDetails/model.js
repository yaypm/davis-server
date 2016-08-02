'use strict';

const states = require('./states');

module.exports = [
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': false, 'template': 'en-us/tense/past',    "state": states.default},
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': true,  'template': 'en-us/tense/past',    "state": states.default},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': false, 'template': 'en-us/tense/present', "state": states.default},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': true,  'template': 'en-us/tense/present', "state": states.default}
];