'use strict';

const BbPromise = require('bluebird'),
    logger = require('./logger');

const version = {
    initialized: false,
    branch: null,
    tag: null,
    lastUpdate: null,
    
    init: () => {
        return new BbPromise( (resolve, reject) => {
            // // Removed git-rev node module 9/30/16
            // git.getBranch()
            //     .then( result => {
            //       version.branch = result; 
            //       return git.getTag();
            //     })
            //     .then( result => {
            //         version.tag = result;
            //         return git.getLastCommitDate();
            //     })
            //     .then( result => {
            //         version.lastUpdate = result;
            //         version.initialized = true;
            //         resolve();
            //     })
            //     .catch(err => {
            //         logger.error('Unable to respond to get Git version');
            //         reject(err);
            //     });
            resolve();
        });
    }
    
};

module.exports = version;