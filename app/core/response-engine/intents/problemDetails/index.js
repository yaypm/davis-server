'use strict';
const BbPromise = require('bluebird'),
    _ = require('lodash'),
    Dynatrace = require('../../../dynatrace'),
    common = require('../../utils/common');

const process = function process(davis, data) {
    return new BbPromise((resolve, reject) => {
        //ToDo validate we have a problemId
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);
        dynatrace.problemDetails(data.problemId)
            .then(response => {
                davis.intentData = {
                    problemDetails: response
                };

                common.addTextResponse(davis.exchange, 'Grabbed detailed data from Dynatrace');
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
    });
};

const hasError = function(intentData) {
    return _.isNil(_.get(intentData, 'problem.result.problems'));
};

module.exports.process = process;