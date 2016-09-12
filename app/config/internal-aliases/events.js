'use strict';

const EVENT_TYPES = {
    availability: 'availability',
    errors: 'errors',
    performance: 'performance',
    resources: 'resources'
};

const events = [
    {
        name: 'WEB_CHECK_GLOBAL_OUTAGE',
        type: EVENT_TYPES.availability,
        friendly: ['a global outage for synthetic based web checks']
    },
    {
        name: 'PROCESS_CUSTOM_AVAILABILITY',
        type: EVENT_TYPES.availability,
        friendly: ['a process is unavailable']
    },
    {
        name: 'PROCESS_LOG_AVAILABILITY',
        type: EVENT_TYPES.availability,
        friendly: ['an availability issue affecting a user defined process']
    },
    {
        name: 'OPENSTACK_KEYSTONE_UNHEALTHY',
        type: EVENT_TYPES.availability,
        friendly: ['Open Stack Keystone is unhealthy']
    },
    {
        name: 'HOST_LOG_AVAILABILITY',
        type: EVENT_TYPES.availability,
        friendly: ['a host availability issue was discovered in the logs']
    },
    {
        name: 'PROCESS_CRASHED',
        type: EVENT_TYPES.availability,
        friendly: ['a process that crashed', 'a crashed process']
    },
    {
        name: 'MOBILE_APP_CRASH_RATE_INCREASED',
        type: EVENT_TYPES.availability,
        friendly: ['an increase in mobile app crashes']
    },
    {
        name: 'RDS_OF_SERVICE_UNAVAILABLE',
        type: EVENT_TYPES.availability,
        friendly: ['a relational database service is unavailable']
    },
    {
        name: 'PGI_OF_SERVICE_UNAVAILABLE',
        type: EVENT_TYPES.availability,
        friendly: ['a process group instance is currently unavailable']
    },
    {
        name: 'CONNECTION_LOST',
        type: EVENT_TYPES.availability,
        friendly: ['a connection was lost']
    },
    {
        name: 'PROCESS_UNAVAILABLE',
        type: EVENT_TYPES.availability,
        friendly: ['an unavailable process']
    },
    {
        name: 'HOST_OF_SERVICE_UNAVAILABLE',
        type: EVENT_TYPES.availability,
        friendly: ['a host is unavailable']
    },
    {
        name: 'HOST_CONNECTION_LOST',
        type: EVENT_TYPES.availability,
        friendly: ['an issue connecting to the host']
    },
    {
        name: 'WEB_CHECK_LOCAL_OUTAGE',
        type: EVENT_TYPES.availability,
        friendly: ['a local outage for synthetic based web checks']
    },
    {
        name: 'PROCESS_CUSTOM_ERROR',
        type: EVENT_TYPES.errors,
        friendly: ['a user defined process error']
    },
    {
        name: 'PROCESS_LOG_ERROR',
        type: EVENT_TYPES.errors,
        friendly: ['an error found in the process log']
    },
    {
        name: 'HOST_LOG_ERROR',
        type: EVENT_TYPES.errors,
        friendly: ['an error found in the host log']
    },
    {
        name: 'JAVASCRIPT_ERROR_RATE_INCREASED',
        type: EVENT_TYPES.errors,
        friendly: ['an increase in JavaScript errors']
    },
    {
        name: 'MOBILE_APP_HTTP_ERROR_RATE_INCREASED',
        type: EVENT_TYPES.errors,
        friendly: ['an increase in mobile app errors']
    },
    {
        name: 'FAILURE_RATE_INCREASED',
        type: EVENT_TYPES.errors,
        friendly: ['an increase in failure rate']
    },
    {
        name: 'HIGH_CONNECTIVITY_FAILURES',
        type: EVENT_TYPES.errors,
        friendly: ['a high number of connectivity failures']
    },
    {
        name: 'HIGH_DROPPED_PACKETS_RATE',
        type: EVENT_TYPES.errors,
        friendly: ['a high number of dropped packets']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_UNHEALTHY_HOST_RATE',
        type: EVENT_TYPES.errors,
        friendly: ['an unexpected number of unhealthy hosts']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_FAILURE_RATE',
        type: EVENT_TYPES.errors,
        friendly: ['a high failure rate']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_BACKEND_FAILURE_RATE',
        type: EVENT_TYPES.errors,
        friendly: ['a high backend failure rate']
    },
    {
        name: 'HIGH_NETWORK_ERROR_RATE',
        type: EVENT_TYPES.errors,
        friendly: ['a high network error rate']
    },
    {
        name: 'HOST_CONNECTION_FAILED',
        type: EVENT_TYPES.errors,
        friendly: ['an issue connecting to the host']
    },
    {
        name: 'SYNTHETIC_SLOWDOWN',
        type: EVENT_TYPES.performance,
        friendly: ['a decrease in synthetic response time']
    },
    {
        name: 'HOST_LOG_PERFORMANCE',
        type: EVENT_TYPES.performance,
        friendly: ['a host performance issue was discovered in the logs']
    },
    {
        name: 'PROCESS_LOG_PERFORMANCE',
        type: EVENT_TYPES.performance,
        friendly: ['a performance issue discovered in the logs affecting a process']
    },
    {
        name: 'PROCESS_CUSTOM_PERFORMANCE',
        type: EVENT_TYPES.performance,
        friendly: ['a performance issue affecting a user defined process']
    },
    {
        name: 'USER_ACTION_DURATION_DEGRADATION',
        type: EVENT_TYPES.performance,
        friendly: ['a degradation in user action response time']
    },
    {
        name: 'OPENSTACK_KEYSTONE_SLOW',
        type: EVENT_TYPES.performance,
        friendly: ['Open Stack Keystone is performing poorly']
    },
    {
        name: 'MOBILE_APP_HTTP_SLOWDOWN',
        type: EVENT_TYPES.performance,
        friendly: ['a slowdown of HTTP calls on mobile']
    },
    {
        name: 'SERVICE_RESPONSE_TIME_DEGRADED',
        type: EVENT_TYPES.performance,
        friendly: ['a decrease in service response time','a slower service response time','a degraded service response time','an abnormal response time','a higher than expected response time']
    },
    {
        name: 'PROCESS_RESPONSIVENESS_DEGRADATION',
        type: EVENT_TYPES.performance,
        friendly: ['a degradation in the process responsiveness']
    },
    {
        name: 'HIGH_LATENCY',
        type: EVENT_TYPES.performance,
        friendly: ['high latency']
    },
    {
        name: 'HIGH_GC_ACTIVITY',
        type: EVENT_TYPES.performance,
        friendly: ['an abnormal amount of garbage collection activity', 'frequent garbage collection activity']
    },
    {
        name: 'UNEXPECTED_LOW_LOAD',
        type: EVENT_TYPES.performance,
        friendly: ['a lower than expected load on the application']
    },
    {
        name: 'LOW_DISK_SPACE',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of disk space']
    },
    {
        name: 'LOW_STORAGE_SPACE',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of disk space']
    },
    {
        name: 'OSI_DOCKER_DEVICEMAPPER_LOW_DATA_SPACE',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of data space affecting Docker']
    },
    {
        name: 'OSI_DOCKER_DEVICEMAPPER_LOW_METADATA_SPACE',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of metadata space affecting Docker']
    },
    {
        name: 'THREADS_RESOURCES_EXHAUSTED',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of available threads']
    },
    {
        name: 'INSUFFICIENT_DISK_QUEUE_DEPTH',
        type: EVENT_TYPES.resources,
        friendly: ['an insufficient disk queue depth']
    },
    {
        name: 'MEMORY_SATURATED',
        type: EVENT_TYPES.resources,
        friendly: ['saturated memory', 'high memory usage']
    },
    {
        name: 'MEMORY_RESOURCES_EXHAUSTED',
        type: EVENT_TYPES.resources,
        friendly: ['a lack of memory']
    },
    {
        name: 'DOCKER_MEMORY_SATURATION',
        type: EVENT_TYPES.resources,
        friendly: ['an issue with Docker using all of it\'s allocated memory']
    },
    {
        name: 'CPU_SATURATED',
        type: EVENT_TYPES.resources,
        friendly: ['a saturated CPU', 'an overwhelmed CPU']
    },
    {
        name: 'SLOW_DISK',
        type: EVENT_TYPES.resources,
        friendly: ['slow disk read and write throughput']
    },
    {
        name: 'EBS_VOLUME_HIGH_LATENCY',
        type: EVENT_TYPES.resources,
        friendly: ['a high latency on an EBS volume']
    },
    {
        name: 'OVERLOADED_STORAGE',
        type: EVENT_TYPES.resources,
        friendly: ['storage that\'s overloaded', 'an overloaded storage']
    },
    {
        name: 'HIGH_NETWORK_LOSS_RATE',
        type: EVENT_TYPES.resources,
        friendly: ['a high network loss rate']
    },
    {
        name: 'HIGH_NETWORK_UTILIZATION',
        type: EVENT_TYPES.resources,
        friendly: ['higher than expect network utilization']
    },
    {
        name: 'PGI_HAPROXY_QUEUED_REQUESTS_HIGH',
        type: EVENT_TYPES.resources,
        friendly: ['a large number of requests queued in HA Proxy']
    },
    {
        name: 'PGI_HAPROXY_SESSION_USAGE_HIGH',
        type: EVENT_TYPES.resources,
        friendly: ['a high number of sessions in HA Proxy']
    },
    {
        name: 'PGI_MYSQL_SLOW_QUERIES_RATE_HIGH',
        type: EVENT_TYPES.resources,
        friendly: ['a high number of slow queries affecting MySQL']
    },
    {
        name: 'UNEXPECTED_HIGH_LOAD',
        type: EVENT_TYPES.resources,
        friendly: ['an unexpectedly high amount of load']
    },
    {
        name: 'HOST_TIMEOUT',
        type: EVENT_TYPES.resources,
        friendly: ['a host timeout']
    },
    {
        name: 'HOST_NO_CONNECTION',
        type: EVENT_TYPES.resources,
        friendly: ['no connection to the host']
    },
    {
        name: 'HOST_SHUTDOWN',
        type: EVENT_TYPES.resources,
        friendly: ['a host shutdown']
    },
    {
        name: 'VIRTUAL_MACHINE_SHUTDOWN',
        type: EVENT_TYPES.resources,
        friendly: ['a virtual machine shutdown']
    },
    {
        name: 'ESXI_START',
        type: EVENT_TYPES.resources,
        friendly: ['a ESXi start']
    },
    {
        name: 'HOST_MAINTENANCE',
        type: EVENT_TYPES.resources,
        friendly: ['a host under maintenance']
    }
];

module.exports = events;