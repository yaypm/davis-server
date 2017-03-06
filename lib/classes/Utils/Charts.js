'use strict';

const BbPromise = require('bluebird');
const phantom = BbPromise.promisifyAll(require('phantom-chartjs'));
const _ = require('lodash');

const ChartModel = require('../../models/Charts');

/**
 * Default chart settings
 */
const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;
const CHART_SCALE = 1;
const CHART_TYPE = 'line';

/**
 * In memory cache for PNG
 */
const CACHE_LENGTH = 25;
const cache = Array(CACHE_LENGTH).fill({});

function addToCache(id, image) {
  cache.unshift({ id, image });
  cache.pop();
}

function getFromeCache(id) {
  return _.find(cache, { id });
}


class Charts {
  constructor(davis) {
    this.logger = davis.logger;
    this.running = false;
    this.davis = davis;
  }

  // Should be started by any source that requires chart images
  start() {
    this.logger.debug('Starting the PhantomJS process.');
    if (!this.running) {
      const startTime = Date.now();
      this.running = true;
      return phantom.createChartRendererAsync({})
        .then((renderer) => {
          this.logger.info(`PhantomJS started in ${Date.now() - startTime} ms.`);
          this.renderer = BbPromise.promisifyAll(renderer);

          // Automatically shuts down Phantom if the process is stopped.
          process.on('exit', () => this.stop());
        })
        .catch((err) => {
          this.running = false;
          throw err;
        });
    }
    return BbPromise.resolve();
  }

  save(data, filters, options) {
    // if browser not running return null
    if (!this.running) {
      return BbPromise.resolve();
    }

    let entityId;

    if (_.isString(filters)) {
      this.logger.debug(`Filter chart data by ${filters}.`);
      entityId = filters;
    } else if (_.isArray(filters)) {
      entityId = filters[0];
      this.logger.warn(`Multiple entity IDs aren't supported yet.  Defaulting to ${entityId}.`);
    } else {
      this.logger.debug('No filter was passed to the chart generator.');
      entityId = _.keys(data)[0];
    }

    // Strips off random IDs
    const appname = data.entities[entityId].substring(0, data.entities[entityId].lastIndexOf(' - ') + 1);

    const times = [];
    const points = [];
    _.forEach(data.dataPoints[entityId], (value) => {
      times.push(value[0]);
      // points.push(Math.round(value[1], 2));
      points.push(value[1]);
    });

    const colorTransparent = 'rgba(20, 150, 255, 0.5)';
    const color = 'rgba(20, 150, 255, 1)';

    const config = _.merge({
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      scale: CHART_SCALE,
      chart: {
        type: CHART_TYPE,
        data: {
          labels: times,
          datasets: [{
            label: appname,
            data: points,
            backgroundColor: colorTransparent,
            borderColor: color,
            pointBorderColor: color,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }],
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                round: 'minute',
                minUnit: 'hour',
                unitStepSize: 6,
                /*unitStepSize: 5,
                displayFormats: {
                  hour: 'h:mm',
                },*/
              },
            }],
          },
          legend: {
            display: false,
            position: 'bottom',
          },
        },
      },
    }, options);

    const chart = new ChartModel(config);
    return chart.save()
      .then(() => this.loadPng(chart.uid, config))
      .then(() => `${this.davis.config.getDavisUrl()}/charts/${chart.uid}.png`);
  }

  loadPng(uid, config) {
    const time = Date.now();
    const cachedImage = getFromeCache(uid);
    if (!_.isNil(cachedImage)) {
      this.logger.debug(`Server chart from cache in ${Date.now() - time} ms.`);
      return BbPromise.resolve(cachedImage.image);
    }

    if (config) {
      return this.renderer.renderBufferAsync(config)
        .then((buffer) => {
          this.logger.debug(`The image was rendered in ${Date.now() - time} ms.`);
          addToCache(uid, buffer);
          return buffer;
        });
    }

    return ChartModel.findOne({ uid })
      .then(savedConfig => this.renderer.renderBufferAsync(savedConfig))
      .then((buffer) => {
        this.logger.debug(`The image was rendered in ${Date.now() - time} ms.`);
        addToCache(uid, buffer);
        return buffer;
      });
  }

  loadJson(uid) {
    return ChartModel.findOne({ uid })
      .then((config) => {
        // process data
        return config;
      });
  }

  stop() {
    if (this.running === true) {
      this.logger.info('Shutting down the PhantomJS process.');
      this.renderer.close();
      this.running = false;
    } else {
      this.logger.warn("PhantomJS wasn't running.");
    }
  }
}

module.exports = Charts;
