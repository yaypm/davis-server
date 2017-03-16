import { Component, OnInit, AfterViewInit, 
         Input, Output, EventEmitter, Pipe, 
         PipeTransform }                      from '@angular/core';

// Services
import { ConfigService }                      from '../../../config/config.service';
import { DavisService }                       from '../../../davis.service';
import * as _                                 from "lodash";

@Component({
  selector: 'tags-generic-input',
  templateUrl: './input.component.html',
})
export class TagsGenericInputComponent implements OnInit, AfterViewInit {
  
  @Input() tags: any;
  @Output() tagsChange: EventEmitter<any> = new EventEmitter();

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}
    
  addTag() {
    let tag = this.tags[this.tags.length - 1];
    if (!tag || tag.length > 0) {
      this.tags.push('');
      this.tagsChange.emit();
    } else {
      // focus on existing empty tag
    }
  }
  
  deleteEmptyTags() {
    let index = this.tags.length;
    while (index--) {
      if (this.tags[index].length < 1) {
        this.tags.splice(index, 1);
        this.tagsChange.emit();
      }
    }
  }
  
  preventParentClick(event: any) {
    event.stopPropagation();
  }
  
  ngOnInit() {
    this.tagsChange.emit();
  }
  
  ngAfterViewInit() {}
}
