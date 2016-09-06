'use strict';

const common = require('../../utils/common');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user),
            emoji: emoji(davis)
        };
    }
};

function emoji(davis) {
    return davis.exchange.request.analysed.emoji;
}

module.exports = tagger;