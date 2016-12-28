import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService }  from '../../davis.service';
import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'config-alexa',
  templateUrl: './config-alexa.component.html',
})
export class ConfigAlexaComponent implements OnInit {
  submitted: boolean = false;
  submitButton: string = (this.iConfig.isWizard) ? 'Skip' : 'Save';
  isDirty: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }

  doSubmit() {
    if (this.iDavis.values.user.alexa_ids) {
      this.submitButton = 'Saving...';
      this.iConfig.connectAlexa()
        .then(result => {
          if (result.success) {
            this.iConfig.status['alexa'].success = true;
            this.iConfig.selectView('slack');
          } else {
            this.iConfig.generateError('alexa', result.message);
            this.resetSubmitButton();
          }
        },
        error => {
          console.log(error);
          this.iConfig.generateError('alexa', null);
          this.resetSubmitButton();
        })
        .catch(err => {
          if (JSON.stringify(err).includes('invalid token')) {
            this.iDavis.logOut();
          }
        });
    } else {
      this.iConfig.selectView('slack');
    }

    this.submitted = true;
  }
  
  validate() {
    if (this.iDavis.values.user.alexa_ids) {
      this.submitButton = 'Continue';
    } else {
      this.submitButton = 'Skip';
    }
    this.isDirty = !_.isEqual(this.iDavis.values.user, this.iConfig.values.original.user);
  }
  
  resetSubmitButton() {
    this.submitButton = (this.iConfig.isWizard) ? 'Continue' : 'Save';
  }
  
  ngOnInit() {
    document.getElementsByName('alexa')[0].focus();
  }
}
