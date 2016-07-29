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
            
                // Temporary solution, for testing
                renderTemplate('./intents/problemDetails/templates/en-us/tense/past/visual/slack-response.nj', davis)
                    .then(renderedTemplate => {
                        
                        common.addTextResponse(davis.exchange, renderedTemplate);
                        return resolve();
                        
                    })
                    .catch(err => {
                        return reject(err); 
                    });
        
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