import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({name: 'filterSidebarItemsByAdminPipe'})
export class FilterSidebarItemsByAdminPipe implements PipeTransform {
  transform(items: any, obj: any): any {
    items = _.filter(items, (item: any) => { 
      return (!item.admin && (item.name !== 'Notifications' || obj.isSlackEnabled))  || (item.admin && obj.isAdmin && (item.name !== 'Notifications' || obj.isSlackEnabled)); 
    });
    return items;
  }
}