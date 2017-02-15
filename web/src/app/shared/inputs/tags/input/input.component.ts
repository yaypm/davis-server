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
  keys: any = {
    'Application': {
      key: 'Application',
      values: [],
    },
    'Service': {
      key: 'Service',
      values: [],
    },
  };

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}
    
  addTag() {
    let obj = this.tags[this.tags.length - 1];
    if (obj.key && obj.key.length > 0 && obj.value && obj.value.name.length > 0) {
      this.tags.push({ key: null, value: { name: null, entityId: null }, focus: true });
    } else {
      this.tags[this.tags.length - 1].focus = true;
    }
  }
  
  deleteEmptyTags() {
    let index = this.tags.length;
    while (index--) {
      if (this.tags[index].key.length < 1 && index < this.tags.length && this.tags.length > 1) this.tags.splice(index, 1);
    }
  }
  
  preventParentClick(event: any) {
    event.stopPropagation();
  }
  
  ngOnInit() {
    this.tags.push({ key: null, value: { name: null, entityId: null }, focus: false });
    
    this.iConfig.getDynatraceApplications()
      .then(response => {
        if (!response.success) throw new Error(response.message);
        
        response.applications.forEach((application: any) => {
          this.keys['Application'].values.push({ name: application.name, entityId: application.entityId });
        });
        return this.iConfig.getDynatraceServices();
      })
      .then(response => {
        if (!response.success) throw new Error(response.message);
        
        response.services.forEach((service: any) => {
         this.keys['Service'].values.push({ name: service.name, entityId: service.entityId });
        });
      })
      .catch(err => {
        this.iConfig.displayError(err, 'filter');
      });
  }
  
  ngAfterViewInit() {}
}
