'use strict';

const pathBuilder = {

    init: (davis, rootPath) => {
        davis.exchange.template.path = rootPath;
    },

    addStep: (davis, path) => {
        davis.exchange.template.path = `${davis.exchange.template.path}/${path}`;
    }
};

module.exports = pathBuilder;