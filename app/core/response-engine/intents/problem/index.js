'use strict';

const BbPromise = require('bluebird'),
    path = require('path'),
    Dynatrace = require('../../../dynatrace'),
    time = require('../../utils/time'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    common = require('../../utils/common'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);

        dynatrace.getFilteredProblems(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName)
            .then(response => {
                common.saveIntentData(davis, 'problem', response);
                let tags = tagger.tag(davis);
                const decide = new Decide(decision_model);
                let template = decide.template(tags);
                logger.debug(`The template path ${template}`);
                let stateSetter = decide.state(tags);
                return responseBuilder.build(davis, `intents/problem/templates/${template}`, true, stateSetter(davis));
            })
            .then(response => {
                return resolve(response);
            })
            .catch(err => {
                logger.error(err.message);
                return reject(err);
            });
    });
};

module.exports.process = process;