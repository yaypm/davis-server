'use strict';

const BbPromise = require('bluebird'),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    _ = require('lodash'),
    ProblemsModel = require('../../models/events/Problems'),
    logger = require('../../utils/logger');

const problemService = new EventEmitter2({wildcard: true});

/**
 * Validates and saves the problem received from Dynatrace.
 * @param problem - The problem object received from the Dynatrace web hook.
 * @return Promise
 */
problemService.saveProblem = function(problem) {
    return new BbPromise((resolve, reject) => {
        if (problem.ProblemID === 'TESTID') {
            logger.info('Received a custom integration test connection');
            return resolve();
        } else {
            ProblemsModel.findOne({PID: problem.PID})
                .then(res => {
                    if (!_.isNull(res)) {
                        if (res.State === problem.State) {
                            return reject(new Error('A problem with that ID already exists.'));
                        }
                        logger.debug('Updating problem');
                        this.emit('event.problem.resolved', problem);
                        res.State = problem.State;
                        res.ProblemImpact = problem.ProblemImpact;
                        res.ImpactedEntity = problem.ImpactedEntity;
                        res.Tags = problem.Tags;

                        return res.save();
                    } else {
                        logger.debug('Saving a new problem');
                        this.emit('event.problem.open', problem);
                        const problems = new ProblemsModel(problem);
                        return problems.save();
                    }
                })
                .then(() => {
                    logger.debug(`Problem ${problem.PID} successfully saved to db.`);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
};

module.exports = problemService;