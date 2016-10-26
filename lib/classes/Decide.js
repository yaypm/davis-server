'use strict';

const DecisionTree = require('decision-tree'),
    _ = require('lodash');

const RESERVED_COLUMN_NAMES = {
    output: 'output'
};

class Decide {
    constructor(model) {
        this.model = model;
    }

    predict(tags) {
        const model = this.model;
        const class_name = RESERVED_COLUMN_NAMES.output;
        const features = [];
        
        _.each(model[0], (value, key) => {if(!_.has(RESERVED_COLUMN_NAMES, key)) features.push(key);});
        logger.debug(`Dumping tags: ${JSON.stringify(tags)}`);
        logger.debug(`Dumping features: ${JSON.stringify(features)}`);
        const dt = new DecisionTree(model, class_name, features);

        return dt.predict(tags);
    }

    getReservedColumnNames() {
        return _.values(RESERVED_COLUMN_NAMES);
    }
}

module.exports = Decide;