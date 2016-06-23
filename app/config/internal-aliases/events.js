'use strict';

let events = [
    {
        name: 'SERVICE_RESPONSE_TIME_DEGRADED',
        friendly: ['decrease in service response time']
    }, {
        name: 'CPU_SATURATED',
        friendly: ['saturated CPU', 'CPU is overwhelmed']
    }
];

module.exports = events;