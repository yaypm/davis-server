'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const DAY_IN_MILLISECONDS = 86400000;

const analyze = {
    userActionData: (data) => {
        logger.debug('Analyzing user action data');
        data = (data.result) ? data.result : data;
        let ranking = [];

        // Calculates the average user action count by application name
        _.each(data.dataPoints, (dataPoint, name) => {
            ranking.push({name: name, avg: _.reduce(dataPoint, (sum, num) => {
                return sum + num[1];
            }, 0) / (dataPoint.length === 0 ? 1 : dataPoint.length)});
        });

        // Ranks them by average user action count (highest to lowest)
        ranking = _.orderBy(ranking, value => {
            return value.avg;
        }, 'desc');

        const response = {
            name: _.split(data.entities[ranking[0].name], ' - ')[0],
            dayOne: {
                min: {
                    time: 0,
                    value: 0.0
                },
                max: {
                    time: 0,
                    value: 0.0
                }
            },
            dayTwo: {
                min: {
                    time: 0,
                    value: 0.0
                },
                max: {
                    time: 0,
                    value: 0.0
                }
            }
        };

        const startTime = _.last(data.dataPoints[ranking[0].name])[0],
            endDay = startTime - DAY_IN_MILLISECONDS,
            endOfDayTwo = endDay - DAY_IN_MILLISECONDS;

        //  Loop over each value filtering on time
        _.each(data.dataPoints[ranking[0].name], value => {
            // The first day
            if (value[0] <= startTime && value[0] > endDay) {
                if (response.dayOne.min.value === 0 || response.dayOne.min.value > value[1]) {
                    response.dayOne.min.time = value[0];
                    response.dayOne.min.value = value[1];
                }
                if (response.dayOne.max.value < value[1]) {
                    response.dayOne.max.time = value[0];
                    response.dayOne.max.value = value[1];
                }
                if (!response.dayOne.current) {
                    response.dayOne.start = {
                        time: value[0],
                        value: value[1]
                    };
                }
            }
            // The second day
            if (value[0] <= endDay && value[0] > endOfDayTwo) {
                if (response.dayTwo.min.value === 0 || response.dayTwo.min.value > value[1]) {
                    response.dayTwo.min.time = value[0];
                    response.dayTwo.min.value = value[1];
                }
                if (response.dayTwo.max.value < value[1]) {
                    response.dayTwo.max.time = value[0];
                    response.dayTwo.max.value = value[1];
                }
                if (!response.dayTwo.current) {
                    response.dayTwo.start = {
                        time: value[0],
                        value: value[1]
                    };
                }
            }
        });

        // Calculates the difference between the days
        response.diff = {
            start: response.dayOne.start.value - response.dayTwo.start.value,
            max: response.dayOne.max.value - response.dayTwo.max.value,
            min: response.dayOne.min.value - response.dayTwo.min.value
        };

        return response;
    }
};

module.exports = analyze;