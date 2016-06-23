'use strict';

const intentPath = require('../shared/intentPath'),
    pathBuilder = require('../../utils/pathBuilder'),
    logger = require('../../../../utils/logger'),
    time = require('../../utils/time'),
    _ = require('lodash');

/**
 * Helps validate that we actually received the data we're expecting
 */
let dataValidation = [{
    'name': 'Checks to make sure we actually received data from Ruxit',
    'priority': 8,
    'on' : true,
    'condition': function(R) {
        R.when(this.intentData.problem.result === null);
    },
    'consequence': function(R) {
        logger.error('Missing problem data!');
        pathBuilder.addStep(this, 'error');
        R.stop();
    }
}, {
    'name': 'Adds a type folder if we did in fact receive data',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(this.intentData.problem.result !== null);
    },
    'consequence': function(R) {
        logger.debug('Adding the type folder to the path');
        pathBuilder.addStep(this, 'tense');
        R.next();
    }
}];

/**
 * Determines the kind of response the user expects
 */
let granularity = [{
    'name': 'Checks if the user is requesting current issues',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed.timeRange === null);
    },
    'consequence': function(R) {
        logger.debug('The user is expecting a response containing current problems');
        pathBuilder.addStep(this, 'present');
        R.next();
    }
}, {
    'name': 'Checks if the user is requesting past issues',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed.timeRange !== null &&
            time.isBefore(this.exchange.request.analysed.timeRange.startTime, this.exchange.startTime));
    },
    'consequence': function(R) {
        logger.debug('The user is expecting a response containing past problems');
        pathBuilder.addStep(this, 'past');
        R.next();
    }
}, {
    'name': 'Checks if the user is requesting future issues',
    'priority': 5,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed.timeRange !== null &&
            !time.isBefore(this.exchange.request.analysed.timeRange.startTime, this.exchange.startTime));
    },
    'consequence': function(R) {
        logger.warn('The user is asking about a future problem.  Either they think we\'re psychic or we misunderstood the question');
        pathBuilder.addStep(this, 'future');
        R.next();
    }
}];

let problemCount = [{
    'name': 'Checks if Ruxit detected zero issues',
    'priority': 1,
    'on' : true,
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length === 0);
    },
    'consequence': function(R) {
        logger.info('No problems were detected');
        pathBuilder.addStep(this, 'zero');
        R.next();
    }
}, {
    'name': 'Checks if Ruxit detected zero issues',
    'priority': 1,
    'on' : true,
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length === 1);
    },
    'consequence': function(R) {
        logger.info('One problem was detected');
        pathBuilder.addStep(this, 'one');
        R.next();
    }
}, {
    'name': 'Checks if Ruxit detected zero issues',
    'priority': 1,
    'on' : true,
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length > 1);
    },
    'consequence': function(R) {
        logger.info('Multiple problems were detected');
        pathBuilder.addStep(this, 'many');
        R.next();
    }
}];

module.exports = _.concat(intentPath, dataValidation, granularity, problemCount);