'use strict';

const BbPromise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    ProblemsModel = require('../../models/events/Problems'),
    logger = require('../../utils/logger');

let instance = null;

class ProblemService extends EventEmitter {

    constructor() {
        super();

        // Simulates a singleton
        if(!instance) {
            instance = this;
        }
    }

    saveProblem(problem) {
        return new BbPromise((resolve, reject) => {
            logger.debug('Saving a new problem');
            ProblemsModel.findOne({PID: problem.PID})
                .then(res => {
                    if(!_.isNull(res)) {
                        if(res.State === problem.State) {
                            return reject(new Error('A problem with that ID already exists.'));
                        }
                        this.emit('closedProblem', problem);
                        res = {
                            State: problem.State,
                            ProblemImpact: problem.ProblemImpact,
                            ImpactedEntity: problem.ImpactedEntity,
                            Tags: problem.Tags
                        };
                        return res.save();
                    } else {
                        this.emit('openProblem', problem);
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
        });
    }
}

module.exports = new ProblemService();