import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

declare var Clipboard:any;

@Component({
    moduleId: module.id,
    selector: 'config-slack',
    templateUrl: './config-slack.component.html',
})
export class ConfigSlackComponent implements OnInit {

    myURL: string = '';
    requestUri: string = '';
    submitted: boolean = false;
    submitButton: string = (this.iConfig.isWizard) ? 'Skip and Finish' : 'Create Davis Slack Bot';
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isDirty: boolean = false;
    isSecretMasked: boolean = true;
    
    constructor(public iDavis: DavisService, public iConfig: ConfigService, public router: Router) {
        this.myURL = `${window.location.protocol}//${window.location.host}`;
        this.requestUri = `${this.myURL}/slack/receive`;
        this.iConfig.values.slack.redirectUri = `${this.myURL}/oauth`;
    }
  
    validate() {
      if (this.iConfig.values.slack.clientId && this.iConfig.values.slack.clientSecret) {
          this.submitButton = 'Create Davis Slack Bot';
      } else if (!this.iConfig.status['slack'].success && this.iConfig.isWizard){
          this.submitButton = 'Skip and Finish';
      }
      this.isDirty = !_.isEqual(this.iConfig.values.slack, this.iConfig.values.original.slack);
    }
    
    resetSubmitButton() {
      this.submitButton = (this.iConfig.isWizard) ? 'Skip and Finish' : 'Create Davis Slack Bot';
    }
    
    doSubmit() {
      this.submitted = true;
      if (!this.iConfig.status['slack'].success && this.iConfig.values.slack.clientId && this.iConfig.values.slack.clientSecret) {
        this.submitButton = 'Saving...';
        this.iConfig.connectSlack()
          .then(result => {
            if (result.success) {
              return this.iConfig.startSlack();
            } else {
              this.iConfig.generateError('slack', result.message);
              this.resetSubmitButton();
            }
          },
          error => {
            console.log(error);
            this.iConfig.generateError('slack', null);
            this.resetSubmitButton();
          })
          .then(result => {
            if (result.success) {
              this.iConfig.status['slack'].success = true;
              this.iDavis.windowLocation(`https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=${this.iConfig.values.slack.clientId}`);
            } else {
              this.iConfig.generateError('slack', result.message);
              this.resetSubmitButton();
            }
          },
          error => {
            console.log(error);
            this.iConfig.generateError('slack', null);
            this.resetSubmitButton();
          })
          .catch(err => {
            if (JSON.stringify(err).includes('invalid token')) {
              this.iDavis.logOut();
            }
          });
      } else if (this.iConfig.isWizard) {
        this.iConfig.isWizard = false;
        this.iDavis.isAdmin = true;
        this.iDavis.isAuthenticated = true;
        this.router.navigate(['/configuration']);
      }
    }
    
    ngOnInit() {
      this.iDavis.isBreadcrumbsVisible = true;
      setTimeout(() => {
        document.getElementsByName('clientId')[0].focus();
        new Clipboard('.clipboard');
      }, 200);
      this.validate();
    }
}
