'use strict';

const DecisionTree = require('decision-tree');
const _ = require('lodash');

const RESERVED_COLUMN_NAMES = { output: 'output' };

class Decide {
  /**
   * Creates an instance of Decide.
   *
   * @param {Object} davis
   *
   * @memberOf Decide
   */
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  /**
   * Predicts the best output based on the supplied model and tags.
   *
   * @param {Array} model - An array of objects containing key value pairs and an output property.
   * @param {Object} tags - Key value pair used to predict the correct output.
   * @returns {Object} output - The output defined in the model.
   *
   * @memberOf Decide
   */
  predict(model, tags) {
    const className = RESERVED_COLUMN_NAMES.output;
    const features = [];

    _.each(model[0], (value, key) => {
      if (!_.has(RESERVED_COLUMN_NAMES, key)) features.push(key);
    });
    this.logger.debug(`Dumping tags: ${JSON.stringify(tags)}`);
    this.logger.debug(`Dumping features: ${JSON.stringify(features)}`);
    const dt = new DecisionTree(model, className, features);

    return dt.predict(tags);
  }

  getReservedColumnNames() {
    return _.values(RESERVED_COLUMN_NAMES);
  }
}

module.exports = Decide;
