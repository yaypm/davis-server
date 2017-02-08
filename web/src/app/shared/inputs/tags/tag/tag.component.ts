import { Component, OnInit, AfterViewInit, 
         Input, Output, EventEmitter, Pipe, 
         PipeTransform }                      from '@angular/core';

// Services
import { ConfigService }                      from '../../../config/config.service';
import { DavisService }                       from '../../../davis.service';
import * as _                                 from "lodash";

@Component({
  selector: 'tag',
  templateUrl: './tag.component.html',
})
export class TagComponent implements OnInit, AfterViewInit {
  
  @Input() tag: any;
  // @Output() toggleProcessingIndicator: EventEmitter<any> = new EventEmitter();
  
  keys: any = {
    'Browser Type': {
      key: 'Browser Type',
      values: [
        'Desktop Browser',
        'Mobile Browser',
        'Robot',
      ],
    },
    'Browser Family': {
      key: 'Browser Family',
      values: [
        'Chrome',
        'Firefox',
        'Safari',
      ],
    },
    'Browser Version': {
      key: 'Browser Version',
      values: [
        'Chrome 11',
        'Chrome 18',
        'Chrome 22',
      ],
    },
  };
  values: any = [];
  keyFocused: boolean = false;
  valueFocused: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
  
  ngOnInit() {}
  
  ngAfterViewInit() {}
}
