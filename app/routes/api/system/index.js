'use strict';

const router = require('express').Router(),
    aliasService = require('../../../services/AliasService'),
    logger = require('../../../utils/logger');

router
    .get('/', (req, res) => {
        logger.info('Responding to get request');
        aliasService.getAll()
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(400).json({msg: err.message});
            });
    })
    .post('/', (req, res) => {
        logger.info('Responding to post request');
        aliasService.putApplication(req.body)
            .then(() => {
                res.status(200).json({msg: 'accepted'});
            })
            .catch(err => {
                if (err.code === 11000)
                    return res.status(400).json({msg: 'Duplicate key detected'});

                res.status(400).json({msg: err.message});
            });
    });


module.exports = router;