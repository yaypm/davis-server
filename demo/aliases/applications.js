'use strict';

/**
 * Allows you, the davis admin, to map multiple aliases with the name defined in Dynatrace
 */

const applications = [{
    name: 'Madison Island',
    display: {
        audible: 'Madison Island',
        visual: 'Madison Island'
    },
    aliases: ['Madison']
},{
    name: 'www.easytravel.com',
    display: {
        audible: 'easy travel',
        visual: 'www.easytravel.com'
    },
    aliases: ['easy travel', 'easytravel.com']
},{
    name: 'www.easytravelb2b.com',
    display: {
        audible: 'easy travel business to business',
        visual: 'easyTravel business to business'
    },
    aliases: ['easy travel', 'easytravel.com']
},{
    name: 'www.weather.easytravel.com',
    display: {
        audible: 'weather easy travel',
        visual: 'easyTravel weather'
    },
    aliases: ['weather', 'whether', 'weather easy travel', 'whether easy travel', 'easy travel weather', 'easy travel whether']
},{
    name: 'www.vmware.easytravel.com',
    display: {
        audible: 'VM ware Easy Travel',
        visual: 'VMware easyTravel'
    },
    aliases: ['vmware', 'vmware easy travel', 'v m ware easy travel']
},{
    name: 'image gallery',
    display: {
        audible: 'image gallery',
        visual: 'image gallery'
    },
    aliases: []
},{
    name: 'easyTravel Demo',
    display: {
        audible: 'easy travel demo',
        visual: 'easyTravel demo'
    },
    aliases: ['easy travel demo']
}];

module.exports = applications;