'use strict';

const DecisionTree = require('decision-tree'),
    _ = require('lodash'),
    logger = require('../../../utils/logger');

const RESERVED_COLUMN_NAMES = {
    template: 'template',
    state: 'state'
};

class Decide {
    constructor(model) {
        this.model = model;
    }

    template(tags) {
        return predict(this.model, RESERVED_COLUMN_NAMES.template, tags);
    }

    state(tags) {
        return predict(this.model, RESERVED_COLUMN_NAMES.state, tags);
    }

    getReservedColumnNames() {
        return _.values(RESERVED_COLUMN_NAMES);
    }
}

function predict(model, class_name, tags) {
    const features = [];
    _.each(model[0], (value, key) => {if(!_.has(RESERVED_COLUMN_NAMES, key)) features.push(key);});
    logger.debug(`Dumping tags: ${JSON.stringify(tags)}`);
    logger.debug(`Dumping features: ${JSON.stringify(features)}`);
    const dt = new DecisionTree(model, class_name, features);

    return dt.predict(tags);
}

module.exports = Decide;