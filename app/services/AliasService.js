'use strict';

const AliasesModel = require('../models/Aliases'),
    _ = require('lodash'),
    logger = require('../utils/logger'),
    BbPromise = require('bluebird');

const AliasService = {

    getAll: () => {
        logger.debug('Getting the list of Aliases');
        return new BbPromise((resolve, reject) => {
            BbPromise.all([
                AliasService.getApplications(),
                AliasService.getServices(),
                AliasService.getInfrastructure()
            ]).spread((applications, services, infrastructure) => {
                resolve({applications, services, infrastructure});
            }).catch(err => {
                reject(err);
            });
        });
    },

    getApplications: () => {
        return AliasesModel.find({ category: 'application'}).exec();
    },

    getServices: () => {
        return AliasesModel.find({ category: 'service'}).exec();
    },

    getInfrastructure: () => {
        return AliasesModel.find({ category: 'infrastructure'}).exec();
    },

    putApplication: (app) => {
        const newApp = new AliasesModel(app);
        return newApp.save();
    }

};

module.exports = AliasService;