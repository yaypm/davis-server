'use strict';

module.exports = [
    { tense: 'past', containsRootCause: false, eligibleToShow: false, notification: false, output: 'tense/past' },
    { tense: 'past', containsRootCause: true, eligibleToShow: false, notification: false, output: 'tense/past' },
    { tense: 'present', containsRootCause: false, eligibleToShow: false, notification: false, output: 'tense/present' },
    { tense: 'present', containsRootCause: true, eligibleToShow: false, notification: false, output: 'tense/present' },
    { tense: 'past', containsRootCause: false, eligibleToShow: true, notification: false, output: 'tense/past' },
    { tense: 'past', containsRootCause: true, eligibleToShow: true, notification: false, output: 'tense/past' },
    { tense: 'present', containsRootCause: false, eligibleToShow: true, notification: false, output: 'tense/present' },
    { tense: 'present', containsRootCause: true, eligibleToShow: true, notification: false, output: 'tense/present' },
];
