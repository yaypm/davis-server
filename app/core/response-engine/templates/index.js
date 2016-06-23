'use strict';

const nunjucks = require('./nunjucks'),
    BbPromise = require('bluebird'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    logger = require('../../../utils/logger');

class Templates {
    /**
     * TemplateEngine
     * @constructs Templates
     * @param {object} davis - The davis object containing user, exchange, and conversertion details
     */
    constructor(davis) {
        Object.assign(this, davis);
    }


    /**
     * Finds and processes templates based on rule metadata
     * @returns {Object} Promise - Returns a promise that resolves to an updated exchange
     */
    buildResponse() {
        return new BbPromise((resolve, reject) => {
            if(!_.has(this, 'exchange.template.path'))
                reject(new Error('No template path defined'));
            
            let templatePath = path.join(__dirname, this.exchange.template.path);
            fs.readdir(templatePath, (err, files) => {
                if (err) {
                    logger.error('Unable to find the following template path: ' + err.path);
                    reject(err);
                }

                //ToDo Look for subfolder I.E. speech / text

                let template = path.join(this.exchange.template.path, _.sample(_.filter(files, file => { return _.endsWith(file, '.nj');})));
                nunjucks.render(template, this, (err, res) => {
                    console.log(res);
                    resolve();
                });
            });
        });
    }
}

module.exports = Templates;