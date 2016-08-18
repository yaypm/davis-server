'use strict';

const _ = require('lodash'),
    common = require('../../utils/common');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user),
            tense: common.getTense(davis.exchange),
            containsRootCause: containsRootCause(davis.intentData),
            eligibleToShow: eligibleToShow(davis.exchange)
        };
    }
};

function containsRootCause(intentData) {
    return _.includes(intentData.problemDetails.result.rankedEvents, event => event.isRootCause === true);
}

function eligibleToShow(exchange) {
    return (exchange.source === 'web');
}

module.exports = tagger;