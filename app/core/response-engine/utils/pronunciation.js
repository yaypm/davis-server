'use strict';

const logger = require('../../../utils/logger');
    
const terms = [
    {
        lowercase: 'api',
        audible: '<say-as interpret-as="spell-out">API</say-as>',
        visual: 'API'
    },
    {
        lowercase: 'cpu',
        audible: '<say-as interpret-as="spell-out">CPU</say-as>',
        visual: 'CPU'
    },
    {
        lowercase: 'is',
        audible: 'is',
        visual: 'is'
    },
    {
        lowercase: 'uri',
        audible: '<say-as interpret-as="spell-out">URI</say-as>',
        visual: 'URI'
    },
    {
        lowercase: 'url',
        audible: '<say-as interpret-as="spell-out">URL</say-as>',
        visual: 'URL'
    }
];
    
const pronunciation = {

    replaceAll: (str, displayType) => {
        
        logger.info('Replacing terms with correct pronunciations');
        
        let words = str.split(' ');
 
        let result = '';
        
        words.forEach( (word, index) => {
            
            terms.forEach( term => {
                
                if (word.toLowerCase() === term.lowercase) {
                    word = term[displayType];
                    logger.info('Term replaced');
                }
                
            });
            
            result += word + ' ';
            
        });
        
        return result.trim();
    }
};
    
module.exports = pronunciation;