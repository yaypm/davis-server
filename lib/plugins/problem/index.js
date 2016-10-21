'use strict';

const BbPromise = require('bluebird');

class Problem {
    constructor(davis, options) {
        this.davis = davis;
        this.options = options;

        this.intents = {
            problem: {
                usage: 'Discover problems',
                lifecycleEvents: [
                    'gatherData',
                    'problem',
                ],
            },
        };

        this.hooks = {
            'problem:gatherData': (exchange) => BbPromise.resolve(exchange).bind(this)
                .then(this.gatherData),
            'problem:problem': (exchange) => BbPromise.resolve(exchange).bind(this)
                .then(this.problem),
        };
    }

    gatherData(exchange) {
    }

    problem(exchange) {
    }
}

module.exports = Problem;
