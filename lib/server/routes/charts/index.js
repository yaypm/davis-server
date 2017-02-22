'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

const timeseriesData = require('../../../plugins/debug/chartDebug/data.json');

router.get('/', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;

  logger.info('Received a request from Alexa!');

  return davis.charts.createTimeseries('APPLICATION-157F59F44773DD97', timeseriesData)
    .then((image) => {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length
      });
      res.end(image); 
    });
});

module.exports = router;
