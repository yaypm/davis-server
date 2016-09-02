'use strict';

const infrastructure = [{
    name: 'eT-demo-2-CustomerFrontend',
    display: {
        audible: 'Easy Travel customer frontend',
        visual: 'easyTravel customer frontend'
    },
    aliases: []
}, {
    name: 'BB1-apache-tomcatjms-iis-node',
    display: {
        audible: 'Easy Travel Business Backend One',
        visual: 'easyTravel Business Backend server #1'
    },
    aliases: []
}, {
    name: 'BB2-apache-tomcatjms-iis-node',
    display: {
        audible: 'Easy Travel Business Backend Two',
        visual: 'easyTravel Business Backend server #2'
    },
    aliases: []
}, {
    name: 'couchDB_ET',
    display: {
        audible: 'couch DB',
        visual: 'CouchDB'
    },
    aliases: []
}, {
    name: '192.168.118.68',
    display: {
        audible: 'VM ware Hypervisor',
        visual: 'PowerEdge R420 VMware ESXi'
    },
    aliases: []
}];

module.exports = infrastructure;