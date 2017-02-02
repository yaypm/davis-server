import { Pipe, PipeTransform }          from '@angular/core';
import * as _                           from "lodash";
import * as $                           from 'jquery';

@Pipe({name: 'slackTagConversionPipe'})
export class SlackTagConversionPipe implements PipeTransform {
  transform(str: string, options: any): any {
    if (str) {
      str = str.replace(/\n/g, '<br>');
      str = str.replace(/\[Root Cause\]/g, '<span class="root-cause">Root Cause</span>');
      let exploded: any;
      
      if (str.indexOf('<http') > -1) {
        
        // Parse and format hyperlink tags like this: <https://cdojfgmpzd.live.dynatrace.com/#problems;gtf=c_1483984800000_1484002800000|5 problems>
        exploded = str.split('<http');
        $.each(exploded, function (index, fragment) {
          if (fragment.indexOf('|') > -1 && fragment.indexOf('>') > -1) {
            let link = (options.isAttachment) ? "<a href='{{url}}' target='_blank' class='card-link-attachment'>{{text}}</a>" : "<a href='{{url}}' target='_blank' class='card-link-text'>{{text}}</a>";
            let url = fragment.substring(0, fragment.indexOf('>'));
            let text = url.substring(url.indexOf('|') + 1);
            url = 'http' + url.substring(0, url.indexOf('|'));
            link = link.replace('{{text}}', text);
            link = link.replace('{{url}}', url);
            exploded[index] = fragment.replace(fragment.substring(0, fragment.indexOf('>') + 1), link);
          }
        });
        str = exploded.join('');
      }
     
      if (str.indexOf('<!date') > -1) {   
        // Parse and format datetime tags like this: <!date^1483984800^{date_short_pretty} {time}|yesterday at 6:00 PM>
        exploded = str.split('<!date');
        $.each(exploded, function (index, fragment) {
          if (fragment.indexOf('|') > -1 && fragment.indexOf('>') > -1) {
            let date = fragment.substring(0, fragment.indexOf('>'));
            let text = date.substring(date.indexOf('|') + 1);
            if (!options.isSentence) text = text.charAt(0).toUpperCase() + text.slice(1);
            text = text.replace('sun', 'Sun').replace('mon', 'Mon').replace('tue', 'Tue').replace('wed', 'Wed').replace('thu', 'Thu').replace('fri', 'Fri').replace('sa', 'Sa');
            exploded[index] = fragment.replace(fragment.substring(0, fragment.indexOf('>') + 1), text);
          }
        });
        str = exploded.join('');
      }
    }
    return str;
  }
}