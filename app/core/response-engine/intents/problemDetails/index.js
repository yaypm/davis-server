'use strict';
const BbPromise = require('bluebird'),
    _ = require('lodash'),
    Dynatrace = require('../../../dynatrace'),
    Nunjucks = require('../../nunjucks'),
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

                common.addTextResponse(davis.exchange, 'This is a placeholder for a much more interesting and useful problem details intent.');
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
    });
};

const renderTemplate = function renderTemplate(templatePath, davis) {
    return new BbPromise((resolve, reject) => {
        
        let template = Nunjucks(davis.config.aliases).renderAsync(templatePath, davis);
        return resolve(template);
        
    });
}

const hasError = function(intentData) {
    return _.isNil(_.get(intentData, 'problem.result.problems'));
};

module.exports.process = process;