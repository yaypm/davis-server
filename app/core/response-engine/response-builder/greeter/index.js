'use strict';

const BbPromise = require('bluebird'),
    _ = require('lodash'),
    Decide = require('../../utils/decide'),
    decision_model = require('./model'),
    tagger = require('./tagger'),
    logger = require('../../../../utils/logger');

module.exports = {
    greet: davis => {
        logger.debug('Generating the user greeting');
        return new BbPromise((resolve, reject) => {
            davis.conversation.lastInteraction()
                .then(result => {
                    let tags = tagger.tag(davis, result);
                    logger.debug(`Dumping the greetings tag: ${JSON.stringify(tags)}`);
                    const decide = new Decide(decision_model);
                    const decision = decide.predict(tags);
                    if (_.isNil(decision.template)) return resolve('');

                    logger.debug(`Using the ${decision.template} for greeting.`);
                    return resolve(`response-builder/greeter/templates/${decision.template}`);
                })
                .catch(err => {
                    logger.error('Ran into an issue creating the greeting.');
                    return reject(err);
                });
        });
    }
};