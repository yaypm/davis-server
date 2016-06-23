'use strict';
const _ = require('lodash'),
    logger = require('../../../../utils/logger'),
    pathBuilder = require('../../utils/pathBuilder');

/**
 * Helps build the initial path to the approperate template
 */

// Language that should be used for the response
let language = [{
    'name': 'Defaults the language to US english',
    'priority': 8,
    'on' : true,
    'condition': function(R) {
        R.when(!_.has(this, 'exchange.template.path'));
    },
    'consequence': function(R) {
        logger.debug('Setting the language to US English');
        pathBuilder.init(this, 'en-us');
        R.next();
    }
}];

// Sent the intent if one was inferred by the request
let intent = [{
    'name': 'Adds the detected intent into to the template path',
    'priority': 8,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed.intent !== null);
    },
    'consequence': function(R) {
        logger.debug(`Setting the intent to ${this.exchange.request.analysed.intent}`);
        pathBuilder.addStep(this, 'intents');
        pathBuilder.addStep(this, this.exchange.request.analysed.intent);
        R.next();
    }
}, {
    'name': 'Informs the user that we aren\'t quite sure what they\'re asking',
    'priority': 8,
    'on' : true,
    'condition': function(R) {
        R.when(this.exchange.request.analysed.intent === null);
    },
    'consequence': function(R) {
        logger.warn('Unknown intent!  Time to deliver that bad news.');
        pathBuilder.addStep(this, 'intents');
        pathBuilder.addStep(this, 'unknown');
        R.stop();
    }
}];

module.exports = _.concat(language, intent);