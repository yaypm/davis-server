'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    time = require('../../utils/time'),
    logger = require('../../../../utils/logger');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user),
            tense: common.getTense(davis.exchange),
            problems: getCount(davis.intentData)
        };
    }
};

const getCount = function(intentData) {
    let problems = _.get(intentData, 'problem.result.problems', null);
    if(!_.isNull(problems)) {
        let numOfProblems = problems.length;
        if (numOfProblems === 0) {
            logger.debug('Zero problems detected');
            return 'zero';
        } else if (numOfProblems === 1) {
            logger.debug('One problem detected');
            return 'one';
        } else if (numOfProblems === 2) {
            logger.debug('Two problems detected');
            return 'two';
        } else {
            logger.debug('Multiple problems detected');
            return 'many';
        }
    } else {
        logger.warn('No problem data supplied!');
        return null;
    }
};

module.exports = tagger;