'use strict';

const _ = require('lodash'),
    common = require('../../utils/common');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user),
            tense: common.getTense(davis.exchange),
            containsRootCause: containsRootCause(davis.intentData),
            eligibleToShow: eligibleToShow(davis.exchange),
            notification: notification(davis.exchange)
        };
    }
};

function containsRootCause(intentData) {
    return _.includes(intentData.problemDetails.result.rankedEvents, event => event.isRootCause === true);
}

function eligibleToShow(exchange) {
    // Only the WebUI is eligible for the show command.
    return (_.get(exchange, 'source') !== 'slack');
}

function notification(exchange) {
    return (_.get(exchange, 'source') === 'system');
}

module.exports = tagger;