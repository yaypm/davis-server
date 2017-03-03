'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

const timeseriesData = require('../../../plugins/debug/chartDebug/data.json');

router.get('/:token.:ext', (req, res) => {
  const davis = req.app.get('davis');

  const token = req.params.token || '';
  const ext = req.params.ext || '';

  switch (ext.toLowerCase()) {
    case 'json':
      res.send(timeseriesData);
      break;
    case 'params':
      res.send(req.params);
      break;
    case 'png':
      return davis.charts.loadPng(token)
        .then((image) => {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length,
            'Cache-Control': 'max-age=31536000',
          });
          res.end(image);
        });
    default:
      res.send('oh no that extension is not supported');
      break;
  }
});

module.exports = router;
