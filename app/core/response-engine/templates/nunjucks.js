'use strict';

const nunjucks = require('nunjucks'),
    BbPromise = require('bluebird'),
    moment = require('moment'),
    env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(__dirname),{
                autoescape: false,
                trimBlocks: true,
                lstripBlocks: true}
        );

/************************************************************
 *                   Problem API Section
 * 
 *   https://mozilla.github.io/nunjucks/api.html#custom-filters
 * 
 ***********************************************************/

/**
 * Plural filter
 */
env.addFilter('plural', function(num, zero, one, other) {
    // Allows us to pass either a number or an array
    if ( Object.prototype.toString.call( num ) === '[object Array]' ) {
        num = num.length;
    }

    switch(num){
    case 0:
        return zero;
    case 1:
        return one;
    default:
        return other;
    }
});

env.addFilter('timeOfDayGreeting', function(datetime) {
    let hour = moment(datetime).format('H');
    if (hour < 6 ) {
        return 'night';
    } else if ( hour < 11 ) {
        return 'morning';
    } else if ( hour < 15 ) {
        return 'afternoon';
    } else if ( hour < 21 ) {
        return 'evening';
    }else {
        return 'night';
    }
});

module.exports = env;