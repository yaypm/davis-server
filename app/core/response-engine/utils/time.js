'use strict';

const moment = require('moment');

const time = {
    /**
     * Used to check if the start date happened before the end date
     * @param {(string|moment object)} startTime - The starting time to test
     * @param {(string|moment object)} endTime - The ending time to test
     * @returns {boolean}
     */
    isBefore: (startTime, endTime) => {
        startTime = moment(startTime);
        endTime = moment(endTime);
        return startTime.isBefore(endTime);
    },

    /**
     * Used to check the number of hours two time frames are apart
     * @param {(string|moment object)} startTime - The starting time to test
     * @param {(string|moment object)} endTime - The ending time to test
     * @returns {number}
     */
    differenceInHours: (startTime, endTime) => {
        return moment.duration(moment().diff(startTime, endTime), 'hours');
    } 

};

module.exports = time;