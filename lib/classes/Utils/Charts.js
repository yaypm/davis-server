'use strict';

const BbPromise = require('bluebird');
const phantom = BbPromise.promisifyAll(require("phantom-chartjs"));
const fs = BbPromise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const moment = require('moment-timezone');

const ChartModel = require('../../models/Charts');

const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;
const CHART_SCALE = 1;
const CHART_TYPE = 'line';

class Charts {
  constructor(davis, config) {
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
				.then(renderer => {
          this.logger.info(`PhantomJS started in ${Date.now() - startTime} ms.`);
					this.renderer = BbPromise.promisifyAll(renderer);

					// Automatically shuts down Phantom if the process is stopped.
					process.on('exit', () => this.stop());
				})
        .catch(err => {
          this.running = false;
          throw err;
        })
		}
    return BbPromise.resolve();
	}

	save(data, options) {
		const entityId = 'APPLICATION-7324C7EE41CC3273';
		var appname = data.entities[entityId].split(' - ')[0];
		var times = [];
		var points = [];
		_.forEach(data.dataPoints[entityId], value => {
			times.push(moment(value[0]).format('h:mm'));
			points.push(Math.round(value[1], 2));
		})

		const colorTransparent = 'rgba(20, 150, 255, 0.5)';
		const color = 'rgba(20, 150, 255, 1)';

		var config = {
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
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					},
					legend: {
						display: true,
						position: 'bottom'
					}
				}
			}
		};

		const util = require('util');
		console.log(util.inspect(config, { depth: null }));

		const chart = new ChartModel(config);
		return chart.save()
			.then(() => chart.uid );
	}

	loadPng(uid) {
		let time;
		return ChartModel.findOne({ uid })
			.then(config => {
				// check if something was found
				time = Date.now();
				return this.renderer.renderBufferAsync(config)
			})
			.then(buffer => {
				this.logger.debug(`The image was rendered in ${Date.now() - time} ms.`);
        return buffer;
			});
	}

	loadJson(uid) {
		return ChartModel.findOne({ uid })
			.then(config => {
				//process data
				return config;
			});
	}

	createTimeseries(entityId, data, options) {
		var appname = data.result.entities[entityId].split(' - ')[0];
		var times = [];
		var points = [];
		_.forEach(data.result.dataPoints[entityId], value => {
			times.push(moment(value[0]).format('h:mm'));
			points.push(Math.round(value[1], 2));
		})


		var config = {
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
						backgroundColor: 'rgba(75,192,192, 0.5)',
						borderColor: 'rgba(75,192,192, 1)',
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			}
		};

    const startTime = Date.now();
		return this.renderer.renderBufferAsync(config)
      .then(buffer => {
        this.logger.debug(`The image was rendered in ${Date.now() - startTime} ms.`);
        return buffer;
      })
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
