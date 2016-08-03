'use strict';

const common = require('../../utils/common');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user)
        }
    }
};

module.exports = tagger;