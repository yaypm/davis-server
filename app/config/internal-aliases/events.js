'use strict';

let events = [
    {
        name: 'SERVICE_RESPONSE_TIME_DEGRADED',
        friendly: ['decrease in service response time']
    },
    {
        name: 'WEB_CHECK_GLOBAL_OUTAGE',
        friendly: ['global outage for synthetic based web checks']
    },
    {
        name: 'FAILURE_RATE_INCREASED',
        friendly: ['failure rate increased']
    },
    {
        name: 'SYNTHETIC_SLOWDOWN',
        friendly: ['decrease in synthetic response time']
    },
    {
        name: 'HIGH_CONNECTIVITY_FAILURES',
        friendly: ['high connectivity failures']
    },
    {
        name: 'HOST_LOG_ERROR',
        friendly: ['error in the host log']
    },
    {
        name: 'PROCESS_LOG_ERROR',
        friendly: ['error in the process log']
    },
    {
        name: 'PGI_OF_SERVICE_UNAVAILABLE',
        friendly: ['a unavailable process group instance']
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
        friendly: ['a connection lost with the infrastructure']
    },
    {
        name: 'MEMORY_SATURATED',
        friendly: ['saturated memory']
    },
    {
        name: 'SLOW_DISK',
        friendly: ['slow disk read and write throughput']
    },
    {
        name: 'DOCKER_MEMORY_SATURATION',
        friendly: ['docker memory saturation']
    },
    {
        name: 'CPU_SATURATED',
        friendly: ['saturated CPU', 'CPU is overwhelmed']
    }
];

module.exports = events;
