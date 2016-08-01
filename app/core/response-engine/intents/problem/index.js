'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');
const fs = BbPromise.promisifyAll(require('fs'));
const path = require('path');
const Dynatrace = require('../../../dynatrace');
const time = require('../../utils/time');
const Nunjucks = require('../../nunjucks');
const Decide = require('../../utils/decide');
const decision_model = require('./model');
const common = require('../../utils/common');
const responseBuilder = require('../../response-builder');

const logger = require('../../../../utils/logger');

const NUNJUCK_EXTENTION = '.nj';
const tags = {};

const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.dynatrace.url, davis.user.dynatrace.token, davis.config, davis.user.dynatrace.strictSSL);
        //ToDo check for future requests

        dynatrace.getFilteredProblems(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName)
            .then(response => {

                davis.intentData = {
                    problem: response
                };
                tags.lang = common.getLanguage(davis.user);
                tags.tense = getTense(davis.exchange);
                tags.problems = getCount(davis.intentData);

                const decide = new Decide(decision_model);
                let template = decide.template(tags);
                logger.debug(`The template path ${template}`);

                let stateSetter = decide.state(tags);
                let followup = stateSetter(davis);

                return responseBuilder.build(davis, null, path.join(`intents/problem/templates/${template}`), followup);
            })
            .then(response => {
                //logger.debug(`The template responded with '${response}'`);
                //common.addTextResponse(davis.exchange, response);
                return resolve(response);
            })
            .catch(err => {
                logger.error(err.message);
                
                return reject(err);
            });
    });
};

const getTemplate = function(templatePath) {
    return new BbPromise((resolve, reject) => {
        fs.readdirAsync(templatePath)
            .then(files => {
                return resolve(randomNunjuckTemplate(files));
            })
            .catch(err => {
                logger.error(`Unable to get a template: ${err.msg}`);
                return reject(err);
            });
    });
};

/**
 * Filters a list of of files by looking for a specific Nunjuck extention
 * @param {Object} files - The list of files and folders returned from fs.
 * @returns {Object} - The filtered list of Nunjuck templates.
 */
function randomNunjuckTemplate(files) {
    return _.sample(_.filter(files, file => { return _.endsWith(file, NUNJUCK_EXTENTION);}));
}

const getTense = function(exchange) {
    let timeRange = _.get(exchange, 'request.analysed.timeRange', null);
    if(isPresentTense(timeRange)) {
        logger.debug('Problem is present tense');
        return 'present';
    } else if (isPastTense(timeRange.startTime, exchange.startTime)) {
        logger.debug('Problem is past tense');
        return 'past';
    } else if (isFutureTense(timeRange.startTime, exchange.startTime)) {
        logger.warn('The user is asking about a future problem.  Either they think we\'re psychic or we misunderstood the question.');
        logger.warn(`They said '${exchange.request.text}' and we thought the requested start time was ${timeRange.startTime}`);
        logger.warn(`which is after the current time ${exchange.startTime}`);
        return 'future';
    } else {
        logger.debug('Unable to figure out a tense');
        return null;
    }
};

const getCount = function(intentData) {
    let problems = _.get(intentData, 'problem.result.problems', null);
    if(!_.isNull(problems)) {
        let numOfProblems = problems.length;
        if (numOfProblems === 0) {
            logger.debug('Zero problems detected');
            return 'zero';
        } else if (numOfProblems === 1) {
            logger.debug('One problem detected');
            return 'one';
        } else if (numOfProblems === 2) {
            logger.debug('Two problems detected');
            return 'two';
        } else {
            logger.debug('Multiple problems detected');
            return 'many';
        }
    } else {
        logger.warn('No problem data supplied!');
        return null;
    }
};

const isPresentTense = function(timeRange) {
    return _.isNil(timeRange);
};

const isPastTense = function(startTime, endTime) {
    return time.isBefore(startTime, endTime);
};

const isFutureTense = function(startTime, endTime) {
    return !time.isBefore(startTime, endTime);
};

module.exports.process = process;