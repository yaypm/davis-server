import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
    moduleId: module.id,
    selector: 'config-slack',
    templateUrl: './config-slack.component.html',
    styleUrls: ['./config-slack.component.css']
})
export class ConfigSlackComponent implements OnInit {

    myURL:string = '';
    submitted: boolean = false;
    success: boolean = false;
    buttonText: string = 'Skip';
    
    constructor(private configService: ConfigService, private router: Router) {
        this.myURL = 'https://' + window.location.host;
    }
    
    validate() {
        if (this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.buttonText = 'Create Davis Slack Bot';
        } else if (!this.success){
            this.buttonText = 'Skip and Finish';
        }
    }
    
    doSubmit() {
        if (!this.success && this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.configService.connectSlack()
              .then( 
                  result => {
                      this.success = true;
                      window.location.assign('https://' + window.location.host);
                  },
                  error => {
                      console.log(error);
                      this.configService.steps[4].success = false;
                  });
            this.submitted = true;
            this.buttonText = 'Finish';
        } else {
            this.configService.windowLocation(this.myURL);
        }
    }
    
    ngOnInit() {
        if (!this.configService.steps[1].success) {
            this.router.navigate([this.configService.steps[1].path]);
        } else if (!this.configService.steps[2].success) {
            this.router.navigate([this.configService.steps[2].path]);
        }
    }

}
