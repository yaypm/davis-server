'use strict';

const logger = require('../../../../../utils/logger'),
    time = require('../../../../utils/time'),
    _ = require('lodash');

const error = [{
    'name': 'Checks if we ran into an issue getting a response',
    'condition': function(R) {
        R.when(_.isNil(_.get(this, 'intentData.problem.result.problems')));
    },
    'consequence': function(R) {
        logger.warn('We didn\'t receive the data we expected');
        this.exchange.template.path.push({error: true});
        R.stop();
    }
}];

/**
 * Determines the kind of response the user expects
 */
const tense = [{
    'name': 'Checks if the user is requesting current issues',
    'condition': function(R) {
        R.when(_.isNull(_.get(this, 'exchange.request.analysed.timeRange')));
    },
    'consequence': function(R) {
        logger.debug('The user is expecting a response containing current problems');
        this.exchange.template.path.push({tense: 'current'});
        R.next();
    }
}, {
    'name': 'Checks if the user is requesting past issues',
    'condition': function(R) {
        R.when(!_.isNull(_.get(this, 'exchange.request.analysed.timeRange')) &&
            time.isBefore(this.exchange.request.analysed.timeRange.startTime, this.exchange.startTime));
    },
    'consequence': function(R) {
        logger.debug('The user is expecting a response containing past problems');
        this.exchange.template.path.push({tense: 'past'});
        R.next();
    }
}, {
    'name': 'Checks if the user is requesting future issues',
    'condition': function(R) {
        R.when(!_.isNull(_.get(this, 'exchange.request.analysed.timeRange')) &&
            !time.isBefore(this.exchange.request.analysed.timeRange.startTime, this.exchange.startTime));
    },
    'consequence': function(R) {
        logger.warn('The user is asking about a future problem.  Either they think we\'re psychic or we misunderstood the question.');
        logger.warn(`They said '${this.exchange.request.text}' and we thought the requested start time was ${this.exchange.request.analysed.timeRange.startTime}`);
        logger.warn(`which is after the current time ${this.exchange.startTime}`);
        this.exchange.template.path.push({tense: 'future'});
        R.next();
    }
}];

let problemCount = [{
    'name': 'Checks if zero problems were detected',
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length === 0);
    },
    'consequence': function(R) {
        logger.debug('No problems were detected');
        this.exchange.template.path.push({problems: 'zero'});
        R.next();
    }
}, {
    'name': 'Checks if one issue was detected',
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length === 1);
    },
    'consequence': function(R) {
        logger.debug('One problem was detected');
        this.exchange.template.path.push({problems: 'one'});
        R.next();
    }
}, {
    'name': 'Checks if multiple problems were detected',
    'condition': function(R) {
        R.when(this.intentData.problem.result.problems.length > 1);
    },
    'consequence': function(R) {
        logger.debug('Multiple problems were detected');
        this.exchange.template.path.push({problems: 'many'});
        R.next();
    }
}];

module.exports = _.concat(error, tense, problemCount);