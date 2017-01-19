import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({name: 'filterUsersByName'})
export class FilterUsersByNamePipe implements PipeTransform {
  transform(users: any, str: string): any {
    if (!str) {
      return users;
    }
    users = _.filter(users, (user: any) => { 
      return user.name.first.toLowerCase().indexOf(str.toLowerCase()) > -1 || user.name.last.toLowerCase().indexOf(str.toLowerCase()) > -1; 
    });
    return users;
  }
}