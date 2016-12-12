import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

// Services
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
    moduleId: module.id,
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
    
    constructor(public iDavis: DavisService, public router: Router) {
        this.myURL = 'https://' + window.location.host;
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
    
    doSubmit() {
      this.submitted = true;
      if (!this.iDavis.config['slack'].success && this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
        this.submitButton = 'Saving...';
        this.iDavis.connectSlack()
          .then(result => {
            if (result.success) {
              this.iDavis.startSlack()
                .then(
                  result => {
                    if (result.success) {
                      sessionStorage.setItem('wizard-finished', 'true');
                      this.iDavis.config['slack'].success = true;
                    } else {
                      this.iDavis.config['slack'].success = false;
                      this.iDavis.config['slack'].error = result.message;
                    }
                  },
                  error => {
                      console.log(error);
                      this.iDavis.config['slack'].success = false;
                  });
            } else {
              this.iDavis.config['slack'].success = false;
              this.iDavis.config['slack'].error = result.message;
            }
          },
          error => {
            console.log(error);
            this.iDavis.config['slack'].success = false;
          });
      } else if (this.iDavis.isWizard) {
        sessionStorage.setItem('wizard-finished', 'true');
        this.iDavis.windowLocation(this.myURL);
      }
    }
    
    ngOnInit() {
      setTimeout(() => {
        document.getElementsByName('clientId')[0].focus();
        new Clipboard('.clipboard');
      }, 200);
    }
}
