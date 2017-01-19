import { Component, OnInit } from '@angular/core';

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

  filter: any;
  submitted: boolean = false;
  submitButton: string = 'Apply Filter';
  submitButtonDefault: string = 'Apply Filter';
  isSelectOpened: boolean = false;
  isDirty: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}

  doSubmit() {
    this.submitted = true;
    this.submitButton = 'Applying Filter...';
    
    // Safari autocomplete polyfill - https://github.com/angular/angular.js/issues/1460
    // this.iConfig.values.filter.name.first = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.name.first, 'first');
    // this.iConfig.values.filter.name.last = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.name.last, 'last');
    // this.iConfig.values.filter.email = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.email, 'email');
    // this.iConfig.values.filter.admin = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.admin, 'admin');
    // this.iConfig.values.filter.timezone = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.timezone, 'timezone');
    // this.iConfig.values.filter.alexa_ids = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.filter.alexa_ids, 'alexa_ids');
    
    this.iConfig.addDavisFilter(this.filter)
      .then(response => {
        if (!response.success) throw new Error(response.message);
        this.iConfig.values.original.filter = _.cloneDeep(this.filter);
        this.isDirty = false;
        this.iConfig.status['user'].success = true;
        this.submitButton = 'Apply Filter';
      })
      .catch(err => {
        this.iConfig.displayError(err, 'filter');
      });
  }

  validate() {
    this.isDirty = !_.isEqual(this.iConfig.values.filter, this.iConfig.values.original.filter);
  }

  onTimezoneChange(tz: string) {
    this.iConfig.values.filter.timezone = tz;
  }
  
  clearAll() {
    this.filter = new DavisModel().filter;
  }

  ngOnInit() {
    this.submitButton = 'Apply Filter';
    this.filter = new DavisModel().filter;
     
    setTimeout(() => {
      this.validate();
    }, 200);
  }
}
