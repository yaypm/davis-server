'use strict';

module.exports = [
    {lang: 'en-us', lastInteraction: 'recent',    timeOfDay: null,        output: {template: null }},
    {lang: 'en-us', lastInteraction: 'weekend',   timeOfDay: null,        output: {template: 'en-us/lastInteraction/weekend' }},
    {lang: 'en-us', lastInteraction: 'yesterday', timeOfDay: null,        output: {template: 'en-us/lastInteraction/yesterday' }},
    {lang: 'en-us', lastInteraction: 'hours',     timeOfDay: 'afternoon', output: {template: 'en-us/lastInteraction/hours/afternoon' }},
    {lang: 'en-us', lastInteraction: 'hours',     timeOfDay: 'evening',   output: {template: 'en-us/lastInteraction/hours/evening' }},
    {lang: 'en-us', lastInteraction: 'hours',     timeOfDay: 'morning',   output: {template: 'en-us/lastInteraction/hours/morning' }},
    {lang: 'en-us', lastInteraction: 'days',      timeOfDay: null,        output: {template: 'en-us/lastInteraction/days' }},
    {lang: 'en-us', lastInteraction: 'weeks',     timeOfDay: null,        output: {template: 'en-us/lastInteraction/weeks' }},
    {lang: 'en-us', lastInteraction: 'default',   timeOfDay: null,        output: {template: null }}
];