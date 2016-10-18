'use strict';

const BbPromise = require('bluebird'),
    Dynatrace = require('../../../dynatrace'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    common = require('../../utils/common'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);

        dynatrace.getFilteredProblems(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName, davis.exchange.request.analysed.status)
            .then(response => {
                common.saveIntentData(davis, 'latestProblem', response);
                let tags = tagger.tag(davis);
                const decide = new Decide(decision_model);
                const decision = decide.predict(tags);
                logger.debug(`The template path ${decision.template}`);

                return responseBuilder.build(davis, `intents/latestProblem/templates/${decision.template}`, true, decision.state(davis));
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