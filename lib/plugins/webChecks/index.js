'use strict';

const _ = require('lodash');
const moment = require('moment');

class WebChecks {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      webChecks: {
        usage: 'Determines if any applications are currently unavailable',
        phrases: [
          'Are any apps down?',
          'Are any applications down?',
          'Is anything down?',
          'Are there any failed web checks?',
          'Is everything up?',
        ],
        lifecycleEvents: [
          'webChecks',
        ],
        clarification: 'I think you were asking me to look into application availability.',
      },
    };

    this.hooks = {
      'webChecks:webChecks': (exchange) => {
        const params = {
          timeseriesId: 'com.dynatrace.builtin:webcheck.availability',
        };
        
        exchange.forceTimeRange('30m');

        return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
          .then((result) => {
            
            let unavailable = [];
            let webChecksEnabled = false;
            
            for (var point in result.dataPoints) {
              let webCheck = result.dataPoints[point][result.dataPoints[point].length - 1];
              if (!webChecksEnabled && webCheck && webCheck !== 'UNMONITORED') webChecksEnabled = true;
              if (webCheck && webCheck === 'NOT_AVAILABLE') {
                  
                let keys = point.split(', ');
                if (keys.length > 1) {
                  
                  unavailable.push({
                    name: result.entities[keys[0]], 
                    location: result.entities[keys[1]]
                  });
                }
              }
            }
            
            return this.response(exchange, unavailable, webChecksEnabled);
          });
      },
    };
  }
  
  response(exchange, unavailable, webChecksEnabled) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;
    
    const say = [];
    const show = new VB.Message();
    
    if (unavailable.length > 0) {
      say.push(`There's currently ${unavailable.length} unavailable applications, based on the most recent web checks.`);
      unavailable.forEach((webCheck, index) => {
        if (index > 1 && index === unavailable.length - 1) {
          say.push(', and ');
        } else if (index > 1) {
          say.push(', ');
        }
        say.push(`${webCheck.name} is unavailable from ${webCheck.location}`);
        if (index === unavailable.length - 1) say.push('.');
      });
      show.addText(say);
    } else if (webChecksEnabled) {
      say.push(`Great news ${exchange.user.name.first}, all applications appear to be available based on the most recent web checks!`);
      show.addText(say);
    } else {
      const url = `${this.davis.config.getDynatraceUrl()}/#webchecks`;
      say.push(`It appears that you don't have any web checks enabled at the moment.`);
      show.addText(say);
      if (this.davis.server.isSocketConnected(exchange.user)) {
        return exchange
          .setLinkUrl(url)
          .setTarget('pushLink')
          .response({ show: show.slack(), say: VB.stringify(say) })
          .followUp('Would you like to open the web check configuration?');
      }
      show.addText(new VB.Link(url, 'Click here to configure web checks.'));
    }
    exchange.response({ show: show.slack(), say: VB.stringify(say) }).end();
  }

}

module.exports = WebChecks;
