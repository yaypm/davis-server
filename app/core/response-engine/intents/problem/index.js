'use strict';

const _ = require('lodash'),
    DecisionTree = require('decision-tree'),
    BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    path = require('path'),
    Dynatrace = require('../../../dynatrace'),
    time = require('../../utils/time'),
    nunjucks = require('../../nunjucks'),
    logger = require('../../../../utils/logger');

const NUNJUCK_EXTENTION = '.nj';
const tags = {};

const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        const dynatrace = new Dynatrace(davis.user.ruxit.url, davis.user.ruxit.token);
        dynatrace.getFilteredProblems(davis.exchange.request.analysed.timeRange, davis.exchange.request.analysed.appName)
            .then(response => {
                davis.intentData = {
                    problem: response
                };
                tags.lang = getLanguage(davis.user);
                //ToDo stop processing on error
                tags.error = hasError(davis.intentData);
                tags.tense = getTense(davis.exchange);
                tags.problems = getCount(davis.intentData);

                let template = selectTemplate(training_model, tags);
                logger.debug(`The template path ${template}`);

                let templatePath = path.join(__dirname, 'templates', template);
                return [template, getTemplate(templatePath)];
            })
            .spread((template,templateName) => {
                logger.debug(`Found a template to use ${templateName}.`);
                return nunjucks.renderAsync(path.join('problem', 'templates', template, templateName), davis);
            })
            .then(response => {
                logger.debug(`The template responsed with '${response}'`);
                addTextResponse(davis.exchange, response);
                return resolve(response);
            })
            .catch(err => {
                logger.err(err.message);
                return reject(err);
            });
    });
};

const addTextResponse = function(exchange, response) {
    exchange.response.show.text = response;
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

const getLanguage = function(user) {
    return user.lang || 'en-us';
};

const hasError = function(intentData) {
    return _.isNil(_.get(intentData, 'problem.result.problems'));
};

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
        logger.warn(`They said '${exchange.request.text}' and we thought the requested start time was ${timeRange.start}`);
        logger.warn(`which is after the current time ${this.exchange.startTime}`);
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



/**
 * decision tree model
 */

const training_model = [
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'zero', 'template': 'en-us/tense/past/zero'},
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'one',  'template': 'en-us/tense/past/one'},
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'many', 'template': 'en-us/tense/past/many'},
	{'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'zero', 'template': 'en-us/tense/present/zero'},
	{'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'one',  'template': 'en-us/tense/present/one'},
    {'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'many', 'template': 'en-us/tense/present/many'},
	{'lang': 'en-us', 'error': false, 'tense': 'future',  'problems': 'zero', 'template': 'en-us/tense/future/zero'},
	{'lang': 'en-us', 'error': true,  'tense': null,      'problems': null,   'template': 'en-us/error'}
];

const selectTemplate = function(model, tags) {
    const CLASS_NAME = 'template';

    const dt = new DecisionTree(training_model, CLASS_NAME, ['lang', 'error', 'tense', 'problems']);
    console.log(tags);
    return dt.predict(tags);
};

module.exports.process = process;