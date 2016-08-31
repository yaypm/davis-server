'use strict';

const git = require('git-rev'),
    BbPromise = require('bluebird'),
    logger = require('./logger');

const version = {
    initialized: false,
    branch: null,
    tag: null,
    lastUpdate: null,
    
    init: () => {
        return new BbPromise( (resolve, reject) => {
            git.getBranch()
                .then( result => {
                   version.branch = result; 
                   return git.getTag();
                })
                .then( result => {
                    version.tag = result;
                    return git.getLastCommitDate();
                })
                .then( result => {
                    version.lastUpdate = result;
                    version.initialized = true;
                    resolve();
                })
                .catch(err => {
                    logger.error('Unable to respond to get Git version');
                    reject(err);
                });
        });
    }
    
};

module.exports = version;