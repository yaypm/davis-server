import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
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
    this.submitted = true;
    this.submitButton = 'Saving...';
    if (this.iDavis.values.dynatrace.url.slice(-1) === '/') {
      this.iDavis.values.dynatrace.url = this.iDavis.values.dynatrace.url.substring(0, this.iDavis.values.dynatrace.url.length - 1);
    }
    this.iDavis.connectDynatrace()
      .then(result => {
        if (result.success) {
           return this.iDavis.validateDynatrace();
        } else {
          this.iDavis.generateError('dynatrace', result.message);
          this.resetSubmitButton();
        }
      },
      error => {
        this.iDavis.generateError('dynatrace', null);
        this.resetSubmitButton();
      })
      .then(result => {
        if (result.success) {
          this.iDavis.config['dynatrace'].success = true;
          if (this.iDavis.isWizard) {
            this.iConfig.SelectView('user');
          } else {
            this.submitButton = 'Save';
          }
        } else {
          this.iDavis.generateError('dynatrace', result.message);
          this.resetSubmitButton();
        }
      },
      err => {
        this.iDavis.generateError('dynatrace', null);
        this.resetSubmitButton();
      })
      .catch(err => {
        if (err.includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
  }

  validate() {
    this.isDirty = !_.isEqual(this.iDavis.values.dynatrace, this.iDavis.values.original.dynatrace);
  }

  resetSubmitButton() {
    this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
  }

  ngOnInit() {
    document.getElementsByName('url')[0].focus();
    if (window.location.protocol === 'http') {
      this.iDavis.config['dynatrace'].error = 'Warning, please note that "https://" is required for Davis to interact with Alexa, Slack, and Watson APIs!';
      this.iDavis.config['dynatrace'].success = false;
    }
    this.validate();
  }
}
