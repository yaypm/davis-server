'use strict';

const BbPromise = require('bluebird'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    intents = require('../'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger'),
    version = require('../../../../utils/version');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        if (version.initialized) {
            davis.version = version;
            let tags = tagger.tag(davis);
            const decide = new Decide(decision_model);
            let template = decide.template(tags);
            logger.debug(`The template path ${template}`);
            let stateSetter = decide.state(tags);
            responseBuilder.build(davis, `intents/davisVersion/templates/${template}`, false, stateSetter(davis))
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
                    message: 'No Git version info available.' 
                }
            };
                       
            const nextIntent = 'error';
            davis.exchange.intent.push(nextIntent);
            intents.runIntent(nextIntent, davis, state)
                .then( () => {
                    resolve();
                })
                .catch(err => {
                    logger.error(err.message);
                    reject(err);
                });
        }
    });
};

module.exports.process = process;