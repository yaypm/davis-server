'use strict';

const BbPromise = require('bluebird'),
    Nlp = require('./nlp');

class Davis {
    constructor(user, conversation, exchange) {
        this.user = user;
        this.conversation = conversation;
        this.exchange = exchange;
    }

    interact() {
        return new BbPromise((resolve, reject) => {
            const nlp = new Nlp(this);
            nlp.process()
            .then( () => {
                
            });
        });
    }
}

module.exports = Davis;