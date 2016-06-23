'use strict';
const RuleEngine = require('node-rules'),
    baseRules = require('./rules/base'),
    BbPromise = require('bluebird'),
    logger = require('../../utils/logger'),
    intentManager = require('./controller/intentManager');

class ResponseEngine {
     /**
     * Response Engine
     * @constructs ResponseEngine
     * @param {Object} davis - The davis object containing user, exchange, and conversertion details
     */
    constructor(davis) {
        Object.assign(this, davis);
    }

    generate() {
        return new BbPromise((resolve, reject) => {
            let R = new RuleEngine(baseRules);

            // Executing the base rules
            R.execute(this, () => {
                logger.info('Finished processing base rules');
                //ToDo use real intent
                let intentHandler = intentManager.getIntent('problem');

                intentHandler.getResponse(this)
                .then( result => {
                    //console.log(result);
                    resolve();
                })
                .catch( err => {
                    reject(err);
                });
                
            });
            //ruleEngine.register()
        });
    }

}

module.exports = ResponseEngine;