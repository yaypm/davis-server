'use strict';

let events = [
    {
        name: 'SERVICE_RESPONSE_TIME_DEGRADED',
        friendly: ['a decrease in service response time','a slower service response time','a degraded service response time','an abnormal response time','a higher than expected response time']
    },
    {
        name: 'WEB_CHECK_GLOBAL_OUTAGE',
        friendly: ['a global outage for synthetic based web checks']
    },
    {
        name: 'FAILURE_RATE_INCREASED',
        friendly: ['an increase in failure rate']
    },
    {
        name: 'SYNTHETIC_SLOWDOWN',
        friendly: ['a decrease in synthetic response time']
    },
    {
        name: 'HIGH_CONNECTIVITY_FAILURES',
        friendly: ['a high number of connectivity failures']
    },
    {
        name: 'HOST_LOG_ERROR',
        friendly: ['an error found in the host log']
    },
    {
        name: 'PROCESS_LOG_ERROR',
        friendly: ['an error found in the process log']
    },
    {
        name: 'PGI_OF_SERVICE_UNAVAILABLE',
        friendly: ['a process group instance is currently unavailable']
    },
    {
        name: 'UNEXPECTED_LOW_LOAD',
        friendly: ['lower than expected load on the application']
    },
    {
        name: 'USER_ACTION_DURATION_DEGRADATION',
        friendly: ['degradation in user action response time']
    },
    {
        name: 'CONNECTION_LOST',
        friendly: ['a connection was lost']
    },
    {
        name: 'MEMORY_SATURATED',
        friendly: ['saturated memory', 'high memory usage']
    },
    {
        name: 'SLOW_DISK',
        friendly: ['slow disk read and write throughput']
    },
    {
        name: 'DOCKER_MEMORY_SATURATION',
        friendly: ['Docker is using all of it\'s allocated memory']
    },
    {
        name: 'CPU_SATURATED',
        friendly: ['a saturated CPU', 'an overwhelmed CPU']
    },
    {
        name: 'PROCESS_CUSTOM_ERROR',
        friendly: ['a user defined process error']
    }
];

module.exports = events;
