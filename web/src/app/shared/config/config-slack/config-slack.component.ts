import { Component } from "@angular/core";

// Services
import { DavisService } from "../../davis.service";

@Component({
    moduleId: module.id,
    selector: "config-slack",
    templateUrl: "./config-slack.component.html",
})
export class ConfigSlackComponent {

    myURL: string = "";
    submitted: boolean = false;
    buttonText: string = "Skip";
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    
    constructor(public davisService: DavisService) {
        this.myURL = "https://" + window.location.host;
    }
    
    //ToDo: Use https://clipboardjs.com library to add copy to clipboard functionality to URLs
    
    validate() {
        if (this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            this.buttonText = "Create Davis Slack Bot";
        } else if (!this.davisService.config["slack"].success){
            this.buttonText = "Skip and Finish";
        }
    }
    
    doSubmit() {
        if (!this.davisService.config["slack"].success && this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            //ToDo: Add redirect url and enabled=true to payload
            this.davisService.connectSlack()
              .then(result => {
                if (result.success) {
                  //REST call to endpoint here, trigger restart of Botkit
                  this.davisService.config["slack"].success = true;
                } else {
                  this.davisService.config["slack"].success = false;
                  this.davisService.config["slack"].error = result.message;
                }
              },
              error => {
                  console.log(error);
                  this.davisService.config["slack"].success = false;
              });
            this.submitted = true;
        } else {
            this.davisService.windowLocation(this.myURL);
        }
    }
}
