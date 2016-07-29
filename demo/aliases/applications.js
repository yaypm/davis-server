'use strict';

/**
 * Allows you, the davis admin, to map multiple aliases with the name defined in Dynatrace
 */

let applications = [{
    name: 'login',
    display: {
        audible: 'Engine-X',
        visual: 'Nginx'
    },
    aliases: ['single sign on', 'sso', 'log on']
},{
    name: 'costco.com',
    display: {
        audible: 'costco',
        visual: 'Nginx'
    },
    aliases: ['costco']
},{
    name: 'mobile_costco.com',
    starred: false,
    type: 'web',
    aliases: ['mobile component of costco.com']
},{
    name: 'resource_timing_costco',
    starred: false,
    type: 'web',
    aliases: ['W3C timings for costco.com']
},{
    name: 'esmas.com',
    starred: false,
    type: 'web',
    aliases: ['Esmas.com']
},{
    name: 'jwu_waitfornextaction_ruxitportal',
    starred: false,
    type: 'web',
    aliases: ['JWU portal application']
},{
    name: 'easyTravel AWS',
    starred: false,
    type: 'web',
    aliases: ['easyTravel application running on amazon web services']
},{
    name: 'Madison Island',
    starred: false,
    type: 'web',
    aliases: ['Madison Island']
},{
    name: 'Madison Island (port 8078)',
    starred: false,
    type: 'web',
    aliases: ['Madison Island application running on port 80 78']
},{
    name: 'www.easytravel.com',
    starred: false,
    type: 'web',
    aliases: ['easyTravel.com']
},{
    name: 'www.weather.easytravel.com',
    starred: false,
    type: 'web',
    aliases: ['weather application of easytravel.com']
},{
    name: 'www.easytravelb2b.com',
    starred: false,
    type: 'web',
    aliases: ['B 2 B component of easytravel.com']
},{
    name: 'www.vmware.easytravel.com',
    starred: false,
    type: 'web',
    aliases: ['vm ware sub domain of easytravel.com']
},{
    name: 'image gallery',
    starred: false,
    type: 'web',
    aliases: ['image gallery application']
},{
    name: 'easyTravel Demo',
    starred: false,
    type: 'web',
    aliases: ['easytravel demo application']
},{
    name: 'google.com',
    starred: false,
    type: 'web',
    aliases: ['google.com', 'google']
},{
    name: 'ruxit.com0011',
    starred: false,
    type: 'web',
    aliases: ['ruxit.com', 'ruxit web application', 'ruxit web portal', 'ruxit platform']
},{
    name: 'homedepot1',
    starred: false,
    type: 'web',
    aliases: ['home depot application', 'home depot web application']
},{
    name: 'www.paypal.com',
    starred: false,
    type: 'web',
    aliases: ['paypal application', 'paypal web application']
}];

module.exports = applications;
