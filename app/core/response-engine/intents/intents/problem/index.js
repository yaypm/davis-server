'use strict';
const intentManager = require('../intentManager'),
    logger = require('../../../../utils/logger');

intentManager.registerIntent({
    name: 'problem',
    required: '',
    supported: 'timeRange,appName',
    examples: [
        'What happened this morning?',
        'Did anything yesterday?'
    ],
    getData: davis => {
        logger.debug('Getting problem data');
    },
    getResponse: davis => {
        logger.info('Responding to a problem intent');
    }
});