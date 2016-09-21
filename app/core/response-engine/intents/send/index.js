'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {
                const response = ['OK, here you go!', 'You should now see this in your browser.', 'Absolutely, I\'m sending the link to you now.'];
                const url = _.get(result, '[1].state.url');

                if (_.isNil(url)) {
                    logger.warn('Unable to send a URL because we don\'t know what to send!');
                    davis.exchange.response.finished = false;
                    common.addTextResponse(davis.exchange, 'I don\'t know what to send you!');
                } else {
                    logger.debug(`Sending the link ${url}`);
                    //Ending the session so the user can focus on the dashboard
                    davis.exchange.response.finished = true;
                    davis.exchange.response.visual.hyperlink = url;
                    common.addTextResponse(davis.exchange, _.sample(response));
                }
                resolve(davis);
            })
            .catch(err => {
                logger.error(`Error loading the conversation history: ${err.message}`);
                return reject(err);
            });
    });
};

module.exports.process = process;