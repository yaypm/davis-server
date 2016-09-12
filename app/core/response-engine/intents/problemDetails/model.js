'use strict';

const states = require('./states');

module.exports = [
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': false, 'eligibleToShow': false, 'notification': false, 'template': 'en-us/tense/past',    'state': states.default},
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': true,  'eligibleToShow': false, 'notification': false, 'template': 'en-us/tense/past',    'state': states.default},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': false, 'eligibleToShow': false, 'notification': false, 'template': 'en-us/tense/present', 'state': states.default},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': true,  'eligibleToShow': false, 'notification': false, 'template': 'en-us/tense/present', 'state': states.default},
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': false, 'eligibleToShow': true,  'notification': false, 'template': 'en-us/tense/past',    'state': states.openLink},
    {'lang': 'en-us', 'tense': 'past',    'containsRootCause': true,  'eligibleToShow': true,  'notification': false, 'template': 'en-us/tense/past',    'state': states.openLink},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': false, 'eligibleToShow': true,  'notification': false, 'template': 'en-us/tense/present', 'state': states.openLink},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': true,  'eligibleToShow': true,  'notification': false, 'template': 'en-us/tense/present', 'state': states.openLink},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': false, 'eligibleToShow': false, 'notification': true,  'template': 'en-us/notification',  'state': states.notification},
    {'lang': 'en-us', 'tense': 'present', 'containsRootCause': true,  'eligibleToShow': false, 'notification': true,  'template': 'en-us/notification',  'state': states.notification}
];