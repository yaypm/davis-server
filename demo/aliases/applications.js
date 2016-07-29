'use strict';

/**
 * Allows you, the davis admin, to map multiple aliases with the name defined in Dynatrace
 */

let applications = [{
    name: 'login',
    display: {
        audible: 'Single Sign On,
        visual: 'SSO'
    },
    aliases: ['single sign on', 'sso', 'log on']
},{
    name: 'costco.com',
    display: {
        audible: 'costco',
        visual: 'costco'
    },
    aliases: ['costco']
}];

module.exports = applications;
