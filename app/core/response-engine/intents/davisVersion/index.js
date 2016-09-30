'use strict';

const BbPromise = require('bluebird'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    intents = require('../'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');
    // version = require('../../../../utils/version');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        if (false) {
        // if (version.initialized) {
        //    davis.version = version;
            let tags = tagger.tag(davis);
            const decide = new Decide(decision_model);
            const decision = decide.predict(tags);

            logger.debug(`The template path ${decision.template}`);
            responseBuilder.build(davis, `intents/davisVersion/templates/${decision.template}`, false, decision.state(davis))
                .then(response => {
                    resolve(response);
                })
                .catch(err => {
                    logger.error(err.message);
                    reject(err);
                });
        } else {
            const state = {
                error: { 
                    message: 'Unfortunately, I wasn\'t able to determine my current Git version.'
                }
            };
                       
            const nextIntent = 'error';
            davis.exchange.intent.push(nextIntent);
            intents.runIntent(nextIntent, davis, state);
            resolve();
        }
    });
};

module.exports.process = process;