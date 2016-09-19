'use strict';

module.exports = [
    {lang: 'en-us', internal: false, lastInteraction: 'recent',    timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: true,  lastInteraction: 'recent',    timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'weekend',   timeOfDay: null,        output: { template: 'en-us/lastInteraction/weekend' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'weekend',   timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'yesterday', timeOfDay: null,        output: { template: 'en-us/lastInteraction/yesterday' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'yesterday', timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'hours',     timeOfDay: 'afternoon', output: { template: 'en-us/lastInteraction/hours/afternoon' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'hours',     timeOfDay: 'afternoon', output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'hours',     timeOfDay: 'evening',   output: { template: 'en-us/lastInteraction/hours/evening' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'hours',     timeOfDay: 'evening',   output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'hours',     timeOfDay: 'morning',   output: { template: 'en-us/lastInteraction/hours/morning' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'hours',     timeOfDay: 'morning',   output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'days',      timeOfDay: null,        output: { template: 'en-us/lastInteraction/days' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'days',      timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'weeks',     timeOfDay: null,        output: { template: 'en-us/lastInteraction/weeks' }},
    {lang: 'en-us', internal: true,  lastInteraction: 'weeks',     timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: false, lastInteraction: 'default',   timeOfDay: null,        output: { template: null }},
    {lang: 'en-us', internal: true,  lastInteraction: 'default',    timeOfDay: null,        output: { template: null }}
];