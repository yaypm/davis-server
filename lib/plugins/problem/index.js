'use strict';

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
            'problem:gatherData': () => BbPromise.bind(this)
                .then(this.gatherData),
            'problem:problem': () => BbPromise.bind(this)
                .then(this.problem),
        };
    }

    gatherData() {

    }

    problem() {

    }
}

module.exports = Problem;
