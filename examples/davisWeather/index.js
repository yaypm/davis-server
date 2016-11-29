#!/usr/bin/env node

'use strict';


const BbPromise = require('bluebird');

// process.on('unhandledRejection', e => logError(e));
// process.noDeprecation = true;

(() => BbPromise.resolve().then(() => {
  // require here so that if anything goes wrong during require,
  // it will be caught.
  const Davis = require('dynatrace-davis'); // eslint-disable-line global-require

  const davis = new Davis({
    logLevel: 'debug',
    userPlugins: ['./davisWeather'], // this line is new (You may need to modify
  });                                // your path if your foldername is different)

  return davis.run();
}))();
