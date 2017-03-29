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
  });


module.exports = router;
