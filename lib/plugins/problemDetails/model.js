'use strict';

module.exports = [
    { tense: 'past', containsRootCause: false, eligibleToPushLink: false, notification: false, output: 'tense/past' },
    { tense: 'past', containsRootCause: true, eligibleToPushLink: false, notification: false, output: 'tense/past' },
    { tense: 'present', containsRootCause: false, eligibleToPushLink: false, notification: false, output: 'tense/present' },
    { tense: 'present', containsRootCause: true, eligibleToPushLink: false, notification: false, output: 'tense/present' },
    { tense: 'past', containsRootCause: false, eligibleToPushLink: true, notification: false, output: 'tense/past' },
    { tense: 'past', containsRootCause: true, eligibleToPushLink: true, notification: false, output: 'tense/past' },
    { tense: 'present', containsRootCause: false, eligibleToPushLink: true, notification: false, output: 'tense/present' },
    { tense: 'present', containsRootCause: true, eligibleToPushLink: true, notification: false, output: 'tense/present' },
];
