'use strict';

const logger = require('../../../utils/logger');
    
// Terms with matching spellings that match words in a string get replaced 
// with appropriate audible or visual representation     
const terms = [
    {
        spellings: ['api'],
        visual: 'API'
    },
    {
        spellings: ['cpu'],
        visual: 'CPU'
    },
    {
        spellings: ['iis'],
        audible: '<say-as interpret-as="spell-out">IIS</say-as>',
        visual: 'IIS'
    },
    {
        spellings: ['nginx'],
        audible: 'engine<say-as interpret-as="spell-out">x</say-as>',
        visual: 'Nginx'
    },
    {
        spellings: ['nodejs', 'node.js'],
        audible: 'node<say-as interpret-as="spell-out">js</say-as>',
        visual: 'Node.js'
    },
    {
        spellings: ['vmware'],
        audible: '<say-as interpret-as="spell-out">vm</say-as>ware',
        visual: 'VMware'
    },
    {
        spellings: ['vsphere'],
        audible: '<say-as interpret-as="spell-out">v</say-as>sphere',
        visual: 'vSphere'
    }
];
    
const pronunciation = {

    replaceAll: (str, displayType) => {
        
        logger.info('Replacing terms with correct pronunciations');
        
        let words = str.split(' ');
 
        let result = '';
        
        words.forEach( word => {
            
            terms.forEach( term => {
               
                // Check if displayType exists for term               
                if (term[displayType]) {
                    
                    term.spellings.forEach( spelling => {
                        
                        if (word.replace(/[^\w\s]/gi, '').toLowerCase() === spelling.replace(/[^\w\s]/gi, '').toLowerCase()) {
                            
                            // Escape special characters as RegExp safeguard
                            spelling = spelling.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                            let reg = new RegExp(spelling, 'gi');
                            word = word.replace(reg, term[displayType]);
                        }
                        
                    })
                
                }
            });
            
            result += word + ' ';
            
        });
        
        return result.trim();
    }
};
    
module.exports = pronunciation;