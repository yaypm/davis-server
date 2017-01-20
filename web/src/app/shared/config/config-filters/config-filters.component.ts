import { Component, OnInit, Pipe, 
         PipeTransform }                            from '@angular/core';
import { FormBuilder }                              from '@angular/forms';
import { Router }                                   from '@angular/router';
import { ConfigService }                            from '../config.service';
import { DavisService }                             from '../../davis.service';
import { DavisModel }                               from '../../models/davis.model';
import * as _                                       from "lodash";

@Component({
  selector: 'config-filters',
  templateUrl: './config-filters.component.html',
})
export class ConfigFiltersComponent implements OnInit {

  submitted: boolean = false;
  submitButton: string = 'Save';
  isPasswordFocused: boolean = false;
  isPasswordMasked: boolean = true;
  addFilter: boolean = true;
  editFilter: boolean = false;
  filters: any = [];
  backImg: string = '/assets/img/back.svg';
  backImgHover: string = '/assets/img/back-hover.svg';
  filterName: string = '';
  
  constructor(public iDavis: DavisService, public iConfig: ConfigService, public router: Router) {}
  
  addMode() {
    this.iConfig.values.filter = new DavisModel().filter;
    this.iConfig.values.filter.origin = 'QUESTION';
    this.iConfig.values.filter.owner = this.iDavis.values.user._id;
    this.iConfig.values.filter.scope = 'global';
    this.iConfig.values.original.filter = _.cloneDeep(this.iConfig.values.filter);
    this.filterName = '';
  }

  editMode(filter: any) {
    this.editFilter = true;
    this.iConfig.values.original.filter = filter;
    this.iConfig.values.filter = _.cloneDeep(filter);
    this.filterName = '';
  }

  getFilters() {
    this.iConfig.getDavisFilters()
      .then(response => {
        if (!response.success) throw new Error(response.message);
        this.iConfig.values.filters = response.filters;
        this.filters = _.cloneDeep(response.filters);
      })
      .catch(err => {
        this.iConfig.displayError(err, 'filters');
      });
  }

  showFilters() {
    this.getFilters();
    this.addFilter = false;
    this.editFilter = false;
    this.iConfig.values.original.filter = new DavisModel().filter;
  }
  
  saveFilter(filter: any) {
    this.iConfig.updateDavisFilter(filter)
      .then(response => {
        if (!response.success) throw new Error(response.message);
        this.iConfig.status['filters'].success = true;
      })
      .catch(err => {
        this.iConfig.displayError(err, 'filter');
      });
  }

  updateFilter(input: any) {
    this.filterName = input.value;
  }

  ngOnInit() {
    this.getFilters();
    this.iConfig.values.filter = new DavisModel().filter;
    this.iConfig.values.filter.origin = 'QUESTION';
    this.iConfig.values.filter.owner = this.iDavis.values.user._id;
    this.iConfig.values.filter.scope = 'global';
    this.iConfig.values.original.filter = new DavisModel().filter;
  }

}
