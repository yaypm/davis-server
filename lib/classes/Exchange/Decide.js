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
    const extendedModel = this._extendModel(model);
    const features = [];

    _.each(extendedModel[0], (value, key) => {
      if (!_.has(RESERVED_COLUMN_NAMES, key)) features.push(key);
    });

    this.logger.debug(`Dumping tags: ${JSON.stringify(tags)}`);
    this.logger.debug(`Dumping features: ${JSON.stringify(features)}`);
    const dt = new DecisionTree(extendedModel, className, features);

    return dt.predict(tags);
  }

  /**
   * Automatically updates the array with null values if they're missing from the model
   *
   * @private
   * @param {Array} model
   * @returns {Array} output
   *
   * @memberOf Decide
   */
  _extendModel(model) {
    const output = [];
    const defaults = {};
    let propArr = [];

    // Creates an array which contains a list of properties
    _.each(model, (e) => {
      propArr = _.union(propArr, _.keys(e));
      return;
    });

    // Builds a default object using the propArr
    _.each(propArr, e => _.set(defaults, `[${e}]`, null));

    // Creates the output array by combining the provided values with the defaults.
    _.each(model, e => output.push(_.defaults(e, defaults)));

    return output;
  }

  getReservedColumnNames() {
    return _.values(RESERVED_COLUMN_NAMES);
  }
}

module.exports = Decide;
