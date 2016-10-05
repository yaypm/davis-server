'use strict';

const BbPromise = require('bluebird'),
    moment = require('moment-timezone'),
    Dynatrace = require('../../../dynatrace'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    analyze = require('./analyze'),
    tagger = require('./tagger'),
    common = require('../../utils/common'),
    responseBuilder = require('../../response-builder'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);

        // Creating a time range that covers the last few days.
        const timeRange = {
            startTime: moment().subtract(3, 'days'),
            stopTime: moment().format()
        };

        // Defining time series data
        const timeseriesOptions = {
            user_actions_per_minute_count: {
                timeseriesId: 'com.ruxit.builtin:app.useractionsperminute',
                aggregationType: 'count'
            }
        };
        
        dynatrace.getFilteredTimeseries(timeRange, davis.exchange.request.analysed.appName, timeseriesOptions.user_actions_per_minute_count)
            .then(response => {
                common.saveIntentData(davis, 'userActivity', analyze.userActionData(response));
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