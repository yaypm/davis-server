'use strict';

const BbPromise = require('bluebird'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        logger.warn('The user is asking for help');
        
        let tags = tagger.tag(davis);
        const decide = new Decide(decision_model);
        const decision = decide.predict(tags);
        logger.debug(`The template path ${decision.template}`);
        davis.exchange.response.finished = true;
        
        responseBuilder.build(davis, `intents/help/templates/${decision.template}`, true, decision.state(davis))
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