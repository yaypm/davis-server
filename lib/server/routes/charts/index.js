'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

const timeseriesData = require('../../../plugins/debug/chartDebug/data.json');

router.get('/:token.:ext', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;

  const token = req.params.token || '';
  const ext = req.params.ext || '';

  switch (ext.toLowerCase()) {
    case 'json':
      return davis.
      res.send(timeseriesData);
      break;
    case 'params':
      res.send(req.params);
      break;
    case 'png':
      //return davis.charts.createTimeseries('APPLICATION-157F59F44773DD97', timeseriesData)
      return davis.charts.loadPng(token)
        .then((image) => {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length
          });
          res.end(image);
        });
    default:
      res.send('oh no that extension is not supported');
      break;
  }
});

module.exports = router;
