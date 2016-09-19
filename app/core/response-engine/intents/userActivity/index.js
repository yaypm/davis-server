'use strict';

const BbPromise = require('bluebird'),
    Dynatrace = require('../../../dynatrace'),
    Decide = require('../../utils/decide'),
    // decision_model = require('./model'),
    // common = require('../../utils/common'),
    responseBuilder = require('../../response-builder'),
    // tagger = require('./tagger'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);
        
        let timeseriesOptions = {
            user_actions_per_minute_count: {
                timeseriesId: 'com.ruxit.builtin:app.useractionsperminute',
                aggregationType: 'count'
            }
        };
        
        dynatrace.getFilteredTimeseries(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName, timeseriesOptions.user_actions_per_minute_count)
            .then(response => {
                // logger.debug('=========== Timeseries: '+JSON.stringify(response));
                // common.saveIntentData(davis, 'problem', response);
                // let tags = tagger.tag(davis);
                // const decide = new Decide(decision_model);
                // let template = decide.template(tags);
                // logger.debug(`The template path ${template}`);
                // let stateSetter = decide.state(tags);
                // return responseBuilder.build(davis, `intents/problem/templates/${template}`, true, stateSetter(davis));
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