'use strict';

const DecisionTree = require('decision-tree'),
    _ = require('lodash'),
    logger = require('../../../../utils/logger');

const CLASS_NAME = 'template';

class ResponseRoute {

    constructor(training_model) {
        // Grabs the first value in the model and pulls out the features and class name
        let features = _.filter(training_model[0], (column) => { return column !== CLASS_NAME; });
        this.dt = new DecisionTree(training_model, CLASS_NAME, features);
    }

    getTemplate(tags) {
        logger.debug('Grabbing the most approprate template based on the extacted tags.');
        return this.dt.predict(tags);
    }
}

module.exports = ResponseRoute;