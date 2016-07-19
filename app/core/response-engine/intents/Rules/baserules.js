'use strict';

const _ = require('lodash'),
    logger = require('../../../utils/logger');

/**
 * Sets the language
 */
const lang = [{
    'name': 'Checks if the response should be English US',
    'condition': function(R) {
        R.when(_.get(this, 'user.lang', null) === null || _.get(this, 'user.lang') === 'en-us');
    },
    'consequence': function(R) {
        logger.debug('The response should be English US');
        this.exchange.template.path.push({lang: 'en-us'});
        R.next();
    }
}];

module.exports = _.concat(lang);