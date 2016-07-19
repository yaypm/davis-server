'use strict';

/**
 * Allows you, the davis admin, to map multiple aliases with the name defined in Dynatrace
 * 
 *      Name: The name of the application as it appears in Dynatrace
 *      Starred: Not currently used
 *      Type: Not currently used
 *      Aliases: A list of possible ways to refer to an application
 */

let applications = [{
    name: 'login',
    display: {
        say: 'Engine-X',
        show: 'Nginx'
    },
    aliases: ['single sign on', 'sso', 'log on']
}, {
    name: 'costco.com',
    display: {
        say: 'costco',
        show: 'Nginx'
    },
    aliases: ['costco']
}];

module.exports = applications;