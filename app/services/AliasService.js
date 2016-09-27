'use strict';

const AliasesModel = require('../models/Aliases'),
    logger = require('../utils/logger'),
    BbPromise = require('bluebird');

const AliasService = {

    getAll: () => {
        logger.debug('Getting the list of Aliases');
        return new BbPromise((resolve, reject) => {
            BbPromise.all([
                AliasService.getAliasesByCategory('application'),
                AliasService.getAliasesByCategory('service'),
                AliasService.getAliasesByCategory('infrastructure')
            ]).spread((applications, services, infrastructure) => {
                resolve({applications, services, infrastructure});
            }).catch(err => {
                reject(err);
            });
        });
    },

    getAliasesByCategory: (category) => {
        return AliasesModel.find({ category: category}).exec();
    },

    createAlias: (name, category, audible, visual, aliases) => {
        const newAlias = new AliasesModel({name, category, display: {audible, visual}, aliases});
        return newAlias.save();
    },

    updateAlias: (aliasId, audible, visual, aliases) => {
        return new BbPromise((resolve, reject) => {
            AliasesModel.findById({ _id: aliasId })
                .then(alias => {
                    alias.display.audible = audible;
                    alias.display.visual = visual;
                    alias.aliases = aliases;
                    return alias.save();
                })
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    deleteAlias: (aliasId, category) => {
        return AliasesModel.remove({ _id: aliasId, category: category });
    }

};

module.exports = AliasService;