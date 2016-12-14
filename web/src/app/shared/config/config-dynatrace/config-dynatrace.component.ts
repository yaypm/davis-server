import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'config-dynatrace',
  templateUrl: './config-dynatrace.component.html',
})
export class ConfigDynatraceComponent implements OnInit {

  submitted: boolean = false;
  submitButton: string = (this.iDavis.isWizard) ? 'Continue' : 'Save';
  isTokenMasked: boolean = true;
  isDirty: boolean = false;
    
  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
  
  doSubmit() {
    this.submitButton = 'Saving...';
    if (this.iDavis.values.dynatrace.url.slice(-1) === '/') {
      this.iDavis.values.dynatrace.url = this.iDavis.values.dynatrace.url.substring(0, this.iDavis.values.dynatrace.url.length - 1);
    }
    this.iDavis.connectDynatrace()
        .then(result => {
          if (result.success) {
            this.iDavis.validateDynatrace()
            .then(res => {
              if (res.success) {
                this.iDavis.config['dynatrace'].success = true;
                if (this.iDavis.isWizard) {
                  this.iConfig.SelectView('user');
                } else {
                  this.submitButton = 'Save';
                }
              } else {
                this.iDavis.config['dynatrace'].success = false;
                this.iDavis.config['dynatrace'].error = res.message;
                this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
              }
            },
            err => {
              this.iDavis.config['dynatrace'].success = false;
              this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
              this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
            })
            .catch(err => {
              this.iDavis.config['dynatrace'].success = false;
              this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
              this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
            });
          } else {
            this.iDavis.config['dynatrace'].success = false;
            this.iDavis.config['dynatrace'].error = result.message;
            this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
          }
        },
        error => {
          this.iDavis.config['dynatrace'].success = false;
          this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
          this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
        })
        .catch(err => {
          this.iDavis.config['dynatrace'].success = false;
          this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
          this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
        });
    this.submitted = true;
  }
  
  validate() {
    this.isDirty = !_.isEqual(this.iDavis.values.dynatrace, this.iDavis.values.original.dynatrace);
  }
  
  keySubmit(keyCode: any) {
    if (keyCode === 13) {
      this.doSubmit();
    }
  }
  
  ngOnInit() {
    document.getElementsByName('url')[0].focus();
  }
}
