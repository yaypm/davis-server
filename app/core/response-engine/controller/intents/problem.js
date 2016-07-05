'use strict';
const intentManager = require('../intentManager'),
    RuleEngine = require('node-rules'),
    //_ = require('lodash'),
    BbPromise = require('bluebird'),
    problemRules = require('../../rules/intents/problem'),
    Template = require('../../templates'),
    Ruxit = require('../../../dynatrace/ruxit'),
    logger = require('../../../../utils/logger');

intentManager.registerIntent({
    name: 'problem',
    required: '',
    supported: 'timeRange,appName',
    getResponse: davis => {
        logger.info('Responding to a problem intent');

        return new BbPromise((resolve, reject) => {
            let ruxit = new Ruxit(davis.user.ruxit.url, davis.user.ruxit.token);

            ruxit.getFilteredProblems(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName)
            .then( response => {
                logger.info(`Recieved a filtered problem list containing ${response.result.problems.length} problems.`);
                davis.intentData = {
                    problem: response
                };
                let R = new RuleEngine(problemRules);
                R.execute(davis, () => {
                    logger.info('Finished processing problem rules');
                    logger.info(`Will look for a template at ${davis.exchange.template.path}`);
                    let template = new Template(davis);
                    template.buildResponse()
                    .then(() => {
                        resolve(davis);
                    });
                    
                });
            })
            .catch( err => {
                reject(err);
            });
        });
    }
});