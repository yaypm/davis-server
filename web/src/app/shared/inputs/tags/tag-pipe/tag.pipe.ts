import { Pipe, PipeTransform }          from '@angular/core';
import * as _                           from "lodash";
import * as $                           from 'jquery';

@Pipe({name: 'tagPipe'})
export class TagPipe implements PipeTransform {
  transform(keys: any, str: string): any {
    if (str && str.length > 0) {
      str = str.toLowerCase().trim();
      if (Array.isArray(keys)) {
        keys = _.filter(keys, (key: any) => { 
          let result = false;
          let isMultipleWordMatch = false;
          let words = key.split(' ');
          let strs = str.split(' ');
          
          if (words.length > 1) {
            words.forEach((word: string) => {
              if (strs.length > 1) {
                strs.forEach((st: string) => {
                  if (!isMultipleWordMatch) isMultipleWordMatch = word.toLowerCase().indexOf(st) === 0;
                });
                // Once false: result is always false
                if (!result) result = isMultipleWordMatch;
              } else {
                // Once True: result is always true
                if (!result) result = word.toLowerCase().indexOf(str) === 0;
              }
            });
          } else {
            result = key.toLowerCase().indexOf(str) === 0;
          }
          return result;
        });
      } else {
        keys = _.filter(keys, (key: any) => { 
          return key.key.toLowerCase().includes(str); 
        });
      }
    } else if (!Array.isArray(keys)) {
      let array = [];
      for (let key in keys) {
        array.push({key: key, value: keys[key]});
      } 
      keys = array;
    }
    
    return keys;
  }
}