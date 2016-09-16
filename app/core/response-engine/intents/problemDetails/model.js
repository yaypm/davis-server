'use strict';

const states = require('./states');

module.exports = [
    {lang: 'en-us', tense: 'past',    containsRootCause: false, eligibleToShow: false, notification: false, output: { template: 'en-us/tense/past',    state: states.general }},
    {lang: 'en-us', tense: 'past',    containsRootCause: true,  eligibleToShow: false, notification: false, output: { template: 'en-us/tense/past',    state: states.general }},
    {lang: 'en-us', tense: 'present', containsRootCause: false, eligibleToShow: false, notification: false, output: { template: 'en-us/tense/present', state: states.general }},
    {lang: 'en-us', tense: 'present', containsRootCause: true,  eligibleToShow: false, notification: false, output: { template: 'en-us/tense/present', state: states.general }},
    {lang: 'en-us', tense: 'past',    containsRootCause: false, eligibleToShow: true,  notification: false, output: { template: 'en-us/tense/past',    state: states.openLink }},
    {lang: 'en-us', tense: 'past',    containsRootCause: true,  eligibleToShow: true,  notification: false, output: { template: 'en-us/tense/past',    state: states.openLink }},
    {lang: 'en-us', tense: 'present', containsRootCause: false, eligibleToShow: true,  notification: false, output: { template: 'en-us/tense/present', state: states.openLink }},
    {lang: 'en-us', tense: 'present', containsRootCause: true,  eligibleToShow: true,  notification: false, output: { template: 'en-us/tense/present', state: states.openLink }},
    {lang: 'en-us', tense: 'present', containsRootCause: false, eligibleToShow: false, notification: true,  output: { template: 'en-us/notification',  state: states.notification }},
    {lang: 'en-us', tense: 'present', containsRootCause: true,  eligibleToShow: false, notification: true,  output: { template: 'en-us/notification',  state: states.notification }}
];