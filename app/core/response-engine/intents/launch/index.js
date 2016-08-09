'use strict';

const BbPromise = require('bluebird'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    responseBuilder = require('../../response-builder'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        let tags = tagger.tag(davis);
        const decide = new Decide(decision_model);
        let template = decide.template(tags);
        logger.debug(`The template path ${template}`);
        let stateSetter = decide.state(tags);
        responseBuilder.build(davis, `intents/launch/templates/${template}`, false, stateSetter(davis))
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