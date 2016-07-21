'use strict';
const BbPromise = require('bluebird'),
    _ = require('lodash'),
    Dynatrace = require('../../../dynatrace'),
    common = require('../../utils/common');

const process = function process(davis, data) {
    return new BbPromise((resolve, reject) => {
        //ToDo validate we have a problemId
        const dynatrace = new Dynatrace(davis.user.ruxit.url, davis.user.ruxit.token);
        dynatrace.problemDetails(data.problemId)
            .then(response => {
                davis.intentData = {
                    problemDetails: response
                };

                common.addTextResponse(davis.exchange, 'Grabbed detailed data from Dynatrace');
                return resolve();
            });
    });
};

const hasError = function(intentData) {
    return _.isNil(_.get(intentData, 'problem.result.problems'));
};

module.exports.process = process;