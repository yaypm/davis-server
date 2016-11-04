import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
    moduleId: module.id,
    selector: 'step5',
    templateUrl: './step5.component.html',
    styleUrls: ['./step5.component.css']
})
export class Step5Component implements OnInit {

    myURL:string = '';
    submitted: boolean = false;
    success: boolean = false;
    buttonText: string = 'Skip';
    
    constructor(private wizardService: WizardService, private router: Router) {
        this.myURL = 'https://' + window.location.host;
    }
    
    validate() {
        if (this.wizardService.values.slack.clientId && this.wizardService.values.slack.clientSecret) {
            this.buttonText = 'Create Davis Slack Bot';
        } else if (!this.success){
            this.buttonText = 'Skip';
        }
    }
    
    doSubmit() {
        if (!this.success && this.wizardService.values.slack.clientId && this.wizardService.values.slack.clientSecret) {
            this.wizardService.connectSlack()
              .then( 
                  result => {
                      this.success = true;
                      this.wizardService.steps[4].status = 'success';
                  },
                  error => {
                      console.log(error);
                      this.wizardService.steps[4].status = 'failure';
                  });
            this.submitted = true;
            this.buttonText = 'Next';
        } else {
            this.router.navigate(['wizard/src/step6']);
        }
    }
    
    ngOnInit() {
        if (this.wizardService.steps[1].status !== 'success') {
            this.router.navigate(['wizard/src/step2']);
        } else if (this.wizardService.steps[2].status !== 'success') {
            this.router.navigate(['wizard/src/step3']);
        }
    }

}
