'use strict';

const RuleEngine = require('node-rules'),
    BbPromise = require('bluebird'),
    _ = require('lodash'),
    baserules = require('./baserules'),
    logger = require('../../../utils/logger');

class Rules {
    constructor(davis) {
        Object.assign(this, davis);
    }

    process(rules) {
        return new BbPromise((resolve, reject) => {
            logger.debug('Processing the rules');
            let R = new RuleEngine(_.concat(baserules, rules));
            R.execute(this, davis => {
                logger.debug('Finished processing base rules');
                
                //ToDo Add error handling
                return resolve(davis);
            });
        });
    }
}

module.exports = Rules;