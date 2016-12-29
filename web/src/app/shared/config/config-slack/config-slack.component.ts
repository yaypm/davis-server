import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

// Services
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

declare var Clipboard:any;

@Component({
    selector: 'config-slack',
    templateUrl: './config-slack.component.html',
})
export class ConfigSlackComponent implements OnInit {

    myURL: string = '';
    requestUri: string = '';
    submitted: boolean = false;
    submitButton: string = (this.iDavis.isWizard) ? 'Skip and Finish' : 'Create Davis Slack Bot';
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isDirty: boolean = false;
    isSecretMasked: boolean = true;

    constructor(public iDavis: DavisService, public router: Router) {
        this.myURL = `${window.location.protocol}//${window.location.host}`;
        this.requestUri = `${this.myURL}/slack/receive`;
        this.iDavis.values.slack.redirectUri = `${this.myURL}/oauth`;
    }

    validate() {
      if (this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
          this.submitButton = 'Create Davis Slack Bot';
      } else if (!this.iDavis.config['slack'].success && this.iDavis.isWizard){
          this.submitButton = 'Skip and Finish';
      }
      this.isDirty = !_.isEqual(this.iDavis.values.slack, this.iDavis.values.original.slack);
    }

    resetSubmitButton() {
      this.submitButton = (this.iDavis.isWizard) ? 'Skip and Finish' : 'Create Davis Slack Bot';
    }

    doSubmit() {
      this.submitted = true;
      if (!this.iDavis.config['slack'].success && this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
        this.submitButton = 'Saving...';
        this.iDavis.connectSlack()
          .then(result => {
            if (result.success) {
              return this.iDavis.startSlack();
            } else {
              this.iDavis.generateError('slack', result.message);
              this.resetSubmitButton();
            }
          },
          error => {
            console.log(error);
            this.iDavis.generateError('slack', null);
            this.resetSubmitButton();
          })
          .then(result => {
            if (result.success) {
              this.iDavis.config['slack'].success = true;
              this.iDavis.windowLocation(`https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=${this.iDavis.values.slack.clientId}`);
            } else {
              this.iDavis.generateError('slack', result.message);
              this.resetSubmitButton();
            }
          },
          error => {
            console.log(error);
            this.iDavis.generateError('slack', null);
            this.resetSubmitButton();
          })
          .catch(err => {
            if (err.includes('invalid token')) {
              this.iDavis.logOut();
            }
          });
      } else if (this.iDavis.isWizard) {
        this.iDavis.isWizard = false;
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
