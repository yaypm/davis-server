'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

const FilterModel = require('../models/Filters');

const GLOBAL_SCOPE = 'global';

class Filters {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  getFilterByScope(scope) {
    return BbPromise.all([
      FilterModel.findOne({ scope, enabled: true }).exec(),
      FilterModel.findOne({ scope: GLOBAL_SCOPE, enabled: true }).exec(),
    ]).spread((scopeFilter, globalFilter) => {
      let filter = null;
      if (!_.isNull(scopeFilter)) {
        this.logger.debug(`Found a scope filter for '${scope}'.`);
        filter = scopeFilter;
      } else if (!_.isNull(globalFilter)) {
        this.logger.debug('Found a global filter.');
        filter = globalFilter;
      }
      return filter;
    });
  }

  getFilters() {
    return FilterModel.find({}).populate('owner').exec();
  }

  getFilter(id) {
    return FilterModel.findOne({ _id: id }).populate('owner').exec();
  }

  createFilter(filter) {
    const filterModel = new FilterModel(filter);
    return filterModel.save();
  }

  updateFilter(id, filter) {
    return FilterModel.findOneAndUpdate({ _id: id }, filter, { runValidators: true }).exec();
  }

  deleteFilter(id) {
    return FilterModel.findOne({ _id: id }).remove().exec();
  }
}

module.exports = Filters;
