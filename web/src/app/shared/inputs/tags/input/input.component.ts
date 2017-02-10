import { Component, OnInit, AfterViewInit, 
         Input, Output, EventEmitter, Pipe, 
         PipeTransform }                      from '@angular/core';

// Services
import { ConfigService }                      from '../../../config/config.service';
import { DavisService }                       from '../../../davis.service';
import * as _                                 from "lodash";

@Component({
  selector: 'tags-input',
  templateUrl: './input.component.html',
})
export class TagsInputComponent implements OnInit, AfterViewInit {
  
  // @Input() message: any;
  // @Input() isDavis: boolean;
  // @Output() toggleProcessingIndicator: EventEmitter<any> = new EventEmitter();
  
  tags: any = [];

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}
  
  ngOnInit() {
    this.tags.push({key: null, value: null});
  }
  
  ngAfterViewInit() {}
}
