import { Component, OnInit, 
         Input, Output, 
         EventEmitter }           from '@angular/core';

// Services
import { ConfigService }          from '../config.service';
import { DavisService }           from '../../davis.service';
import { DavisModel }             from '../../models/davis.model';
import * as _                     from 'lodash';

@Component({
  selector: 'config-filter',
  templateUrl: './config-filter.component.html',
})
export class ConfigFilterComponent implements OnInit {

  @Input() isNewFilter: boolean;
  
  filterOptions: any;
  submitted: boolean = false;
  submitButton: string;
  submitButtonDefault: string;
  isDirty: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}

  doSubmit() {
    this.submitted = true;
    this.submitButton = (this.isNewFilter) ? 'Adding...' : 'Saving...';
    
    // Safari autocomplete polyfill - https://github.com/angular/angular.js/issues/1460
    this.iConfig.values.filter.name = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.name, 'name');
    this.iConfig.values.filter.description = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.description, 'description');
    this.iConfig.values.filter.scope = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.scope, 'scope');
    this.iConfig.values.filter.origin = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.origin, 'origin');
    
    // Safari autocomplete polyfill - Update any autofilled checkboxes
    this.validate();
    
    let filterCleaned = this.removeNullProperties(this.iConfig.values.filter);
    
    if (this.isNewFilter) {
      this.iConfig.addDavisFilter(filterCleaned)
        .then(response => {
          if (!response.success) throw new Error(response.message);
          this.iConfig.values.filter = new DavisModel().filter;
          this.iConfig.values.filter.origin = 'ALL';
          this.iConfig.values.filter.owner = this.iDavis.values.user._id;
          this.iConfig.values.filter.scope = 'global';
          this.iConfig.values.original.filter = new DavisModel().filter;
          this.isDirty = false;
          this.iConfig.status['filter'].success = true;
          this.submitButton = this.submitButtonDefault;
        })
        .catch(err => {
          this.iConfig.displayError(err, 'filter');
          this.submitButton = this.submitButtonDefault;
        });
    } else {
      this.iConfig.updateDavisFilter(filterCleaned)
        .then(response => {
          if (!response.success) throw new Error(response.message);
          this.iConfig.values.original.filter = filterCleaned;
          this.isDirty = false;
          this.iConfig.status['filter'].success = true;
          this.submitButton = this.submitButtonDefault;
        })
        .catch(err => {
          this.iConfig.displayError(err, 'filter');
          this.submitButton = this.submitButtonDefault;
        });
    }
  }

  validate() {
    
    // Get checkbox values
    for(let key in this.filterOptions) {
      if (key !== 'origin') {
        this.iConfig.values.filter[key] = [];
        this.filterOptions[key].forEach((option: any)  => {
          if (option.enabled) this.iConfig.values.filter[key].push(option.value);
        });
      }
    }
    this.isDirty = !_.isEqual(this.iConfig.values.filter, this.iConfig.values.original.filter);
  }
  
  removeNullProperties(filter: any): any {
    
    Object.keys(filter).forEach(key => {
      if (filter[key] && typeof filter[key] === 'object') {
        this.removeNullProperties(filter[key]);
      } else if (filter[key] == null || filter[key].length < 1) {
        delete filter[key];
      }
    });
      
    return filter;
  }

  onOriginChange(origin: string) {
    this.iConfig.values.filter.origin = origin;
  }

  ngOnInit() {
    this.submitButton = (this.isNewFilter) ? 'Add' : 'Save';
    this.submitButtonDefault = (this.isNewFilter) ? 'Add' : 'Save';
    this.iConfig.values.filter.origin = 'QUESTION';
    this.iConfig.values.filter.owner = this.iDavis.values.user._id;
    this.filterOptions = new DavisModel().filterOptions;
    
    // Set checkbox values
    for(let key in this.filterOptions) {
      if (key !== 'origin') {
        this.iConfig.values.filter[key].forEach((value: any, index: any) => {
          this.filterOptions[key].forEach((option: any, index: any) => {
            if (option.value === value) this.filterOptions[key][index].enabled = true;
          });
        });
      }
    }
    
    setTimeout(() => {
      this.validate();
    }, 200);
  }
}
