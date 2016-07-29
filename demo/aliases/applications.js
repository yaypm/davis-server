'use strict';

/**
 * Allows you, the davis admin, to map multiple aliases with the name defined in Dynatrace
 */

let applications = [{
    name: 'login',
    display: {
        say: 'Single Sign On',
        show: 'SSO'
    },
    aliases: ['single sign on', 'sso', 'log on']
},{
    name: 'costco.com',
    display: {
        say: 'costco',
        show: 'costco'
    },
    aliases: ['costco']
}];

module.exports = applications;
