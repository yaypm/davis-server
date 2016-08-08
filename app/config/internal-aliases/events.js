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
        name: 'WEB_CHECK_LOCAL_OUTAGE',
        friendly: ['a local outage for synthetic based web checks']
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
        friendly: ['a lower than expected load on the application']
    },
    {
        name: 'USER_ACTION_DURATION_DEGRADATION',
        friendly: ['a degradation in user action response time']
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
        friendly: ['an issue with Docker using all of it\'s allocated memory']
    },
    {
        name: 'CPU_SATURATED',
        friendly: ['a saturated CPU', 'an overwhelmed CPU']
    },
    {
        name: 'PROCESS_CUSTOM_ERROR',
        friendly: ['a user defined process error']
    },
    {
        name: 'INSUFFICIENT_DISK_QUEUE_DEPTH',
        friendly: ['an insufficient disk queue depth']
    },
    {
        name: 'PROCESS_CRASHED',
        friendly: ['a process that crashed', 'a crashed process']
    },
    {
        name: 'HIGH_LATENCY',
        friendly: ['high latency']
    },
    {
        name: 'HIGH_GC_ACTIVITY',
        friendly: ['an abnormal amount of garbage collection activity', 'frequent garbage collection activity']
    },
    {
        name: 'MEMORY_RESOURCES_EXHAUSTED',
        friendly: ['a lack of memory']
    },
    {
        name: 'THREADS_RESOURCES_EXHAUSTED',
        friendly: ['a lack of available threads']
    },
    {
        name: 'HIGH_NETWORK_LOSS_RATE',
        friendly: ['a high network loss rate']
    },
    {
        name: 'PROCESS_UNAVAILABLE',
        friendly: ['an unavailable process']
    },
    {
        name: 'OVERLOADED_STORAGE',
        friendly: ['storage that\'s overloaded', 'an overloaded storage']
    },
    {
        name: 'HOST_SHUTDOWN',
        friendly: ['a host shutdown']
    },
    {
        name: 'HIGH_DROPPED_PACKETS_RATE',
        friendly: ['a high number of dropped packets']
    },
    {
        name: 'HIGH_NETWORK_ERROR_RATE',
        friendly: ['a high network error rate']
    },
    {
        name: 'HIGH_NETWORK_UTILIZATION',
        friendly: ['higher than expect network utilization']
    },
    {
        name: 'LOW_DISK_SPACE',
        friendly: ['a lack of disk space']
    },
    {
        name: 'UNEXPECTED_HIGH_LOAD',
        friendly: ['an unexpectedly high amount of load']
    },
    {
        name: 'JAVASCRIPT_ERROR_RATE_INCREASED',
        friendly: ['an increase in JavaScript errors']
    },
    {
        name: 'ESXI_START',
        friendly: ['a ESXi start']
    },
    {
        name: 'HOST_CONNECTION_LOST',
        friendly: ['an issue connecting to the host']
    },
    {
        name: 'HOST_CONNECTION_FAILED',
        friendly: ['an issue connecting to the host']
    },
    {
        name: 'HOST_MAINTENANCE',
        friendly: ['a host under maintenance']
    },
    {
        name: 'HOST_NO_CONNECTION',
        friendly: ['no connection to the host']
    },
    {
        name: 'HOST_TIMEOUT',
        friendly: ['a host timeout']
    },
    {
        name: 'VIRTUAL_MACHINE_SHUTDOWN',
        friendly: ['a virtual machine shutdown']
    },
    {
        name: 'PROCESS_RESPONSIVENESS_DEGRADATION',
        friendly: ['a degradation in the process responsiveness']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_UNHEALTHY_HOST_RATE',
        friendly: ['an unexpected number of unhealthy hosts']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_FAILURE_RATE',
        friendly: ['a high failure rate']
    },
    {
        name: 'ELASTIC_LOAD_BALANCER_HIGH_BACKEND_FAILURE_RATE',
        friendly: ['a high backend failure rate']
    },
    {
        name: 'LOW_STORAGE_SPACE',
        friendly: ['a lack of disk space']
    },
    {
        name: 'EBS_VOLUME_HIGH_LATENCY',
        friendly: ['a high latency on an EBS volume']
    },
    {
        name: 'PROCESS_CUSTOM_AVAILABILITY',
        friendly: ['a process is unavailable']
    },
    {
        name: 'PROCESS_CUSTOM_PERFORMANCE',
        friendly: ['a performance issue affecting a user defined process']
    },
    {
        name: 'PROCESS_LOG_AVAILABILITY',
        friendly: ['an availability issue affecting a user defined process']
    },
    {
        name: 'PROCESS_LOG_PERFORMANCE',
        friendly: ['a performance issue discovered in the logs affecting a process']
    },
    {
        name: 'MOBILE_APP_CRASH_RATE_INCREASED',
        friendly: ['an increase in mobile app crashes']
    },
    {
        name: 'MOBILE_APP_HTTP_ERROR_RATE_INCREASED',
        friendly: ['an increase in mobile app errors']
    },
    {
        name: 'MOBILE_APP_HTTP_SLOWDOWN',
        friendly: ['a slowdown of HTTP calls on mobile']
    },
    {
        name: 'PGI_HAPROXY_QUEUED_REQUESTS_HIGH',
        friendly: ['a large number of requests queued in HA Proxy']
    },
    {
        name: 'PGI_HAPROXY_SESSION_USAGE_HIGH',
        friendly: ['a high number of sessions in HA Proxy']
    },
    {
        name: 'PGI_MYSQL_SLOW_QUERIES_RATE_HIGH',
        friendly: ['a high number of slow queries affecting MySQL']
    },
    {
        name: 'HOST_OF_SERVICE_UNAVAILABLE',
        friendly: ['a host is unavailable']
    },
    {
        name: 'RDS_OF_SERVICE_UNAVAILABLE',
        friendly: ['a relational database service is unavailable']
    },
    {
        name: 'HOST_LOG_AVAILABILITY',
        friendly: ['a host availability issue was discovered in the logs']
    },
    {
        name: 'HOST_LOG_PERFORMANCE',
        friendly: ['a host performance issue was discovered in the logs']
    },
    {
        name: 'OSI_DOCKER_DEVICEMAPPER_LOW_DATA_SPACE',
        friendly: ['a lack of data space affecting Docker']
    },
    {
        name: 'OSI_DOCKER_DEVICEMAPPER_LOW_METADATA_SPACE',
        friendly: ['a lack of metadata space affecting Docker']
    }

];

module.exports = events;
