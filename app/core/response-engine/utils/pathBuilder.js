'use strict';

const pathBuilder = {

    init: (davis, rootPath) => {
        davis.exchange.template.path = rootPath;
    },

    addStep: (davis, path) => {
        davis.exchange.template.path = `${davis.exchange.template.path}/${path}`;
    },

    addValue: (davis, item) => {
        davis.exchange.template.path.push(item);
    }
};

module.exports = pathBuilder;