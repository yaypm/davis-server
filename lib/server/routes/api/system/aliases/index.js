'use strict';

const router = require('express').Router();
const _ = require('lodash');

router.get('/', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;
  const service = davis.service;
  logger.info('Responding with all aliases');
  service.getAllAliases()
    .then((aliases) => {
      res.send({ success: true, aliases });
    })
    .catch((err) => {
      res.send({ success: false, message: err.message });
    });
});

router.route('/:category(applications|services|infrastructure)')
  .get((req, res) => {
    const davis = req.app.get('davis');
    const logger = davis.logger;
    const service = davis.service;
    const category = req.params.category;
    logger.info(`Listing all ${category} alias.`);
    service.getAliasesByCategory(category)
      .then((aliases) => {
        res.send({ success: true, [category]: aliases });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  })
  .post((req, res) => {
    const davis = req.app.get('davis');
    const logger = davis.logger;
    const service = davis.service;
    logger.info(`Creating a new ${req.params.category} alias.`);
    service.createAlias(req.body.name, req.params.category, _.get(req, 'body.display.audible'), _.get(req, 'body.display.visual'), req.body.aliases)
      .then(() => {
        res.status(201).json({
          success: true,
          message: `Created a new ${req.params.category} alias for ${req.body.name}.`,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.send({
            success: false,
            message: `An ${req.params.category} alias for ${req.body.name} already exists!`,
          });
        } else {
          res.send({ success: false, message: err.message });
        }
      });
  });

router.route('/:category(applications|services|infrastructure)/:alias_id')
  .put((req, res) => {
    const davis = req.app.get('davis');
    const logger = davis.logger;
    const service = davis.service;
    logger.info(`Attempting to update ${req.params.alias_id}`);
    service.updateAlias(req.params.alias_id, req.body.audible, req.body.visual, req.body.aliases)
      .then(() => {
        res.send({
          success: true,
          message: `The ${req.params.category} alias with the ID ${req.params.alias_id} has been updated.`,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: err.message,
        });
      });
  })
  .delete((req, res) => {
    const davis = req.app.get('davis');
    const logger = davis.logger;
    const service = davis.service;
    logger.info(`Attempting to delete ${req.params.alias_id}`);
    service.deleteAlias(req.params.alias_id, req.params.category)
      .then((response) => {
        if (response.result.n > 0) {
          res.send({
            success: true,
            message: `The ${req.params.category} alias with the ID ${req.params.alias_id} has been removed.`,
          });
        } else {
          res.send({
            success: false,
            message: `Unable to find an ${req.params.category} alias with the ID ${req.params.alias_id}.`,
          });
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          message: err.message,
        });
      });
  });


module.exports = router;
