'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    Trie = natural.Trie,
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.debug('Starting a multiple choice intent.');
    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {
                let nextIntent = _.get(result, '[1].state.next.multipleChoice', 'error'),
                    state = {};

                if (nextIntent !== 'error') {
                    //ToDo remove the assumption that we're drilling into problem details!
                    let request = davis.exchange.request.text;

                    if (sentenceContain(request, ['third', 'three', '3'])) {
                        logger.debug('The user asked for the third choice');
                        state.problemId = result[1].state.problemIds[2];
                    } else if (sentenceContain(request, ['second', 'two', '2'])) {
                        logger.debug('The user asked for the second choice');
                        state.problemId = result[1].state.problemIds[1];
                    } else if (sentenceContain(request, ['first', 'one', '1'])) {
                        logger.debug('The user asked for the first choice');
                        state.problemId = result[1].state.problemIds[0];
                    } else if (sentenceContain(request, ['neither', 'none', 'not interested', 'zero', '0'])) {
                        logger.debug('The user couldn\'t make up their mind');
                        //updating the next intent to 'no' because the user isn't interested in any of these values
                        nextIntent = 'no';
                    } else {
                        const choices = (result[1].state.problemIds.length === 2) ? 'either the first one or the second one' : 'either the first, second, or third one';
                        state.error = { message: `I know choice is hard but you need to make one!  Please let me know which one you're interested in by saying ${choices}.` };
                        davis.exchange.state = {
                            problemIds:  result[1].state.problemIds,
                            next: {
                                multipleChoice: 'problemDetails'
                            }
                        };
                        davis.exchange.response.finished = false;
                    }
                } else {
                    logger.warn('Unable to let the user choose an option because we don\'t have any context.');
                    state.error = {message: 'I\'m sorry but I don\'t know how to respond to that' };
                }

                davis.exchange.intent.push(nextIntent);
                return intents.runIntent(nextIntent, davis, state);
            })
            .then(() => {
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
    });
};

function sentenceContain(sentence, values) {
    const tokenizedSentence = tokenizer.tokenize(sentence),
        trie = new Trie();

    trie.addStrings(tokenizedSentence);
    return _.some(values, value => {
        return trie.contains(value);
    });
}

module.exports.process = process;