'use strict';

const BbPromise = require('bluebird');

const FilterModel = require('../models/Filters');

const GLOBAL_SCOPE = 'global';

class Filters {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  getFiltersByScope(scope, origin) {
    const originRegex = (origin) ? new RegExp(`ALL|${origin}`) : /ALL/;
    return BbPromise.all([
      FilterModel.find({ scope, enabled: true, origin: originRegex }).exec(),
      FilterModel.find({ scope: GLOBAL_SCOPE, enabled: true, origin: originRegex }).exec(),
    ]).spread((scopeFilter, globalFilter) => {
      let filters = [];
      if (scopeFilter.length > 0) {
        this.logger.debug(`Found a scope filter for '${scope}'.`);
        filters = scopeFilter;
      } else if (globalFilter.length > 0) {
        this.logger.debug('Found a global filter.');
        filters = globalFilter;
      }
      return filters;
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
