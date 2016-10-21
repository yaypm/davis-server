'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
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
    let problems = _.get(intentData, 'latestProblem.result.problems', null);
    if(!_.isNull(problems)) {
        let numOfProblems = problems.length;
        if (numOfProblems === 0) {
            logger.debug('Zero problems detected');
            return 'zero';
        } else {
            logger.debug('One problem detected');
            return 'one';
        }
    } else {
        logger.warn('No problem data supplied!');
        return null;
    }
};

module.exports = tagger;