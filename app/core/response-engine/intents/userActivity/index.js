'use strict';

const BbPromise = require('bluebird'),
    moment = require('moment-timezone'),
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

        // Defining timeseries data
        const timeseriesOptions = {
            user_actions_per_minute_count: {
                timeseriesId: 'com.ruxit.builtin:app.useractionsperminute',
                aggregationType: 'count'
            }
        };
        
        dynatrace.getFilteredTimeseries(timeRange, davis.exchange.request.analysed.appName, timeseriesOptions.user_actions_per_minute_count)
            .then(response => {
                common.saveIntentData(davis, 'userActivity', response);
                const decide = new Decide(decision_model);
                const decision = decide.predict(tagger.tag(davis));
                logger.debug(`The template path ${decision.template}`);
                return responseBuilder.build(davis, `intents/userActivity/templates/${decision.template}`, true, decision.state(davis));
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