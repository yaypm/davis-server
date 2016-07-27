'use strict';

const _ = require('lodash'),
    DecisionTree = require('decision-tree'),
    BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    nunjucks = require('../nunjucks'),
    logger = require('../../../utils/logger');

const NUNJUCK_EXTENTION = '.nj';

module.exports = {
    getTemplate: (templatePath) => {
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
    },

    render: (relativeTemplatePath, davis) => {
        return nunjucks(davis.config.aliases).renderAsync(relativeTemplatePath, davis);
    }
};

/**
 * Filters a list of of files by looking for a specific Nunjuck extention
 * @param {Object} files - The list of files and folders returned from fs.
 * @returns {Object} - The filtered list of Nunjuck templates.
 */
function randomNunjuckTemplate(files) {
    const filteredTemplateList = _.filter(files, file => {return _.endsWith(file, NUNJUCK_EXTENTION);});

    if (filteredTemplateList.length === 0) {
        logger.error('Unable to find a template!');
        return new Error('Unable to find template.');
    } else {
        return _.sample(filteredTemplateList);
    }
}