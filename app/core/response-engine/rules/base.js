'use strict';
const moment = require('moment-timezone'),
    logger = require('../../../utils/logger');

/**
 * The base rules for every request
 */
let base = [{
    'name': 'Check if the user is authorized',
    'priority': 10,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.authenticated === false);
    },
    'consequence': function(R) {
        logger.warn('rejecting unauthorized user');
        this.exchange.template.name = 'unauthorized';
        R.stop();
    }
}, {
    'name': 'Check if the intent is unknown',
    'priority': 10,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed === null);
    },
    'consequence': function(R) {
        logger.warn('unable to determine what the users intent was.');
        this.exchange.template.name = 'unknown_intent';
        R.stop();
    }
}, {
    'name': 'Check if the user should be greeted after a short pause',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(shouldGreet(this.exchange.startTime, this.conversation.lastInteraction, 2)) ;
    },
    'consequence': function(R) {
        logger.info('Adding a short greeting');
        this.exchange.template.meta.greet = 'short';
        R.next();
    }
}, {
    'name': 'Check if the user should be greeted after a long pause',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(shouldGreet(this.exchange.startTime, this.conversation.lastInteraction, 23)) ;
    },
    'consequence': function(R) {
        logger.info('adding a long greeting');
        this.exchange.template.meta.greet = 'long';
        R.next();
    }
}, {
    'name': 'Check if the user should be greeted after a weekend',
    'priority': 5,
    'on' : false,
    'condition': function(R) {
        R.when(this.processed.greet === 'long');
        //R.when(moment(this.conversation.lastInteraction))
    },
    'consequence': function(R) {
        logger.info('adding a weekend greeting');
        //this.exchange.template.meta.greet = 'weekend';
        R.next();
    }
}];

/**
 * Checks if the user should be greeted based on the last interaction timezone
 * @param {(string|moment object)} requestStart - The start of the time range
 * @param {(string|moment object)} endTime - The end of the time range
 * @param {number} numberOfHours - The number of hours between the current and last interaction
 * @returns {boolean}
 */
function shouldGreet(startTime, endTime, numberOfHours) {    
    return moment.duration(moment().diff(startTime, endTime), 'hours') > numberOfHours;
}

module.exports = base;