import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({name: 'filterFiltersByName'})
export class FilterFiltersByNamePipe implements PipeTransform {
  transform(filters: any, str: string): any {
    filters = _.filter(filters, (filter: any) => { 
      return filter.origin === 'ALL' || filter.origin === 'QUESTION'; 
    });
  
    if (!str) {
      return filters;
    }
    
    filters = _.filter(filters, (filter: any) => { 
      return filter.name.toLowerCase().indexOf(str.toLowerCase()) > -1; 
    });
    return filters;
  }
}