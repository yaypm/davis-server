import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({name: 'filterFiltersByName'})
export class FilterFiltersByNamePipe implements PipeTransform {
  transform(filters: any, obj: any): any {
    filters = _.filter(filters, (filter: any) => { 
      return filter.origin === 'ALL' || filter.origin === obj.origin; 
    });
  
    if (!obj.str) {
      return filters;
    }
    
    filters = _.filter(filters, (filter: any) => { 
      return filter.name.toLowerCase().indexOf(obj.str.toLowerCase()) > -1; 
    });
    return filters;
  }
}