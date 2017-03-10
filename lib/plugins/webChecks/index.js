'use strict';

const _ = require('lodash');
const moment = require('moment');

const VB = this.davis.classes.VB;
const th = this.davis.textHelpers;

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
        clarification: 'I think you were asking me to look into web check availability.',
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
            let isAllUnavailable = true;
            
            for (var point in result.dataPoints) {
              let webCheck = result.dataPoints[point][result.dataPoints[point].length - 1];
              if (!webChecksEnabled && webCheck[1] !== 'UNMONITORED') webChecksEnabled = true;
              if (webCheck[1] === 'AVAILABLE') isAllUnavailable = false;
              if (webCheck[1] === 'NOT_AVAILABLE') {
                  
                let keys = point.split(', ');
                if (keys.length > 1) {
                  
                  unavailable.push({
                    entityId: keys[0],
                    entityName: result.entities[keys[0]],
                    entityLink: VB.Link().slack(`${this.davis.config.getDynatraceUrl()}/#webchecks/webcheckdetailV3;webcheckId=${keys[0]}`, result.entities[keys[0]]),
                    location: result.entities[keys[1]],
                    timestamp: webCheck[0],
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
    
    const say = [];
    const show = new VB.Message();
    const groups = [];
    const url = `${this.davis.config.getDynatraceUrl()}/#webchecks`;

    // Unavailable web checks
    if (unavailable.length > 0) {
      unavailable.forEach(webCheck => {
        
        // Group locations by name
        let isMatch = false;
        groups.forEach((group, index) => {
          if (group.name === webCheck.entityName) {
            groups[index].locations.push(webCheck.location);
            isMatch = true;
          }
        });
        if (!isMatch) groups.push(webCheck);
      });
      
      const text = `There's currently ${groups.length} unavailable web check${ (groups.length > 1) ? 's' : '' }${ (unavailable.length > groups.length) ? ' from multiple locations' : '' }.`;
      say.push(text);
      show.addText(text);
      
      // Limit to five web checks
      if (groups.length > 5) {
        let groupsLength = groups.length;
        groups.splice(5);
        let truncatedWarning = `Here's five of the ${groupsLength} unavailable web checks.`;
        say.push(truncatedWarning);
        show.addText(truncatedWarning);
      }
      
      groups.forEach(group => {
        let card = new VB.Card();
        card.setColor(VB.Colors.RED)
        .addField('Name', group.entityLink, true)
        .addField(`Location${ (group.locations.length > 1) ? 's' : '' }`, 
          th.humanList(group.locations), 
          true);
        show.addCard(card);
        say.push(`${group.entityName} is unavailable from ${th.humanList(group.locations)}.`);
      });
      
    // All web checks available
    } else if (webChecksEnabled) {
      say.push(`Great news ${exchange.user.name.first}, all web checks appear to be available based on the most recent checks!`);
      show.addText(say);
      
    // No web checks monitoring
    } else {
      say.push(`It appears that you don't have any web checks enabled at the moment.`);
      show.addText(say);
      if (this.davis.server.isSocketConnected(exchange.user)) {
        return exchange
          .setLinkUrl(url)
          .setTarget('pushLink')
          .response({ show: show.slack(), say: VB.stringify(say) })
          .followUp('Would you like to configure your web checks?');
      }
      show.addText(new VB.Link(url, 'Click here to configure web checks.'));
    }
    exchange
      .setLinkUrl(url)
      .setTarget('pushLink')
      .response({ show: show.slack(), say: VB.stringify(say) })
      .followUp('Would you like to open web checks?');
  }

}

module.exports = WebChecks;
