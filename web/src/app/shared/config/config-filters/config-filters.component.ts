import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService }          from '../config.service';
import { DavisService }           from '../../davis.service';
import { DavisModel }             from '../../models/davis.model';
import * as _                     from 'lodash';

@Component({
  selector: 'config-filters',
  templateUrl: './config-filters.component.html',
})
export class ConfigFiltersComponent implements OnInit {

  filters: any;
  submitted: boolean = false;
  submitButton: string = 'Apply Filters';
  submitButtonDefault: string = 'Apply Filters';
  isSelectOpened: boolean = false;
  isDirty: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}

  doSubmit() {
    this.submitted = true;
    this.submitButton = 'Applying Filters...';
    
    // Safari autocomplete polyfill - https://github.com/angular/angular.js/issues/1460
    // this.iConfig.values.filters.name.first = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.name.first, 'first');
    // this.iConfig.values.filters.name.last = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.name.last, 'last');
    // this.iConfig.values.filters.email = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.email, 'email');
    // this.iConfig.values.filters.admin = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.admin, 'admin');
    // this.iConfig.values.filters.timezone = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.timezone, 'timezone');
    // this.iConfig.values.filters.alexa_ids = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filters.alexa_ids, 'alexa_ids');
    
    this.iConfig.addDavisFilters(this.filters)
      .then(response => {
        if (!response.success) throw new Error(response.message);
        this.iConfig.values.original.filters = _.cloneDeep(this.filters);
        this.isDirty = false;
        this.iConfig.status['user'].success = true;
        this.submitButton = 'Apply Filters';
      })
      .catch(err => {
        this.iConfig.displayError(err, 'filters');
      });
  }

  validate() {
    this.isDirty = !_.isEqual(this.iConfig.values.filters, this.iConfig.values.original.filters);
  }

  onTimezoneChange(tz: string) {
    this.iConfig.values.filters.timezone = tz;
  }
  
  clearAll() {
    this.filters = new DavisModel().filters;
  }

  ngOnInit() {
    this.submitButton = 'Apply Filters';
    this.filters = new DavisModel().filters;
     
    setTimeout(() => {
      this.validate();
    }, 200);
  }
}
