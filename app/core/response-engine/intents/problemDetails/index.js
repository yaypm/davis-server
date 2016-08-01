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
                common.saveIntentData(davis, 'problemDetails', response);
                common.addTextResponse(davis.exchange, 'This is a placeholder for a much more interesting and useful problem details intent.');
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
    });
};

module.exports.process = process;