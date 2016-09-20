'use strict';

const BbPromise = require('bluebird'),
    moment = require('moment-timezone'),
    _ = require('lodash'),
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

        // Creating a one week time range
        const timeRange = {
            startTime: moment().subtract(1, 'weeks'),
            stopTime: moment().format()
        };

        dynatrace.getFilteredProblems(timeRange, davis.exchange.request.analysed.appName)
            .then(response => {
                // Filtering by infrastructure problems that impacted users
                _.remove(response.result.problems, problem => {
                    return !(problem.impactLevel === 'APPLICATION' && _.some(problem.rankedImpacts, impact => {
                        return  _.includes(['MEMORY_SATURATED', 'MEMORY_RESOURCES_EXHAUSTED', 'CPU_SATURATED'], impact.eventType);
                    }));
                });

                common.saveIntentData(davis, 'scalability', response);
                const decide = new Decide(decision_model);
                const decision = decide.predict(tagger.tag(davis));
                logger.debug(`The template path ${decision.template}`);
                return responseBuilder.build(davis, `intents/scalability/templates/${decision.template}`, true, decision.state(davis));
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