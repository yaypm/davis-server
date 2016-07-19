'use strict';

const templateBuilder = {

    addPathValue: (davis, item) => {
        davis.exchange.template.path.push(item);
    }

};

module.exports = templateBuilder;