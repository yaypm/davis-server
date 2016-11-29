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
    
    constructor(public iDavis: DavisService) {
        this.myURL = "https://" + window.location.host;
    }
    
    //ToDo: Use https://clipboardjs.com library to add copy to clipboard functionality to URLs
    
    validate() {
        if (this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
            this.buttonText = "Create Davis Slack Bot";
        } else if (!this.iDavis.config["slack"].success){
            this.buttonText = "Skip and Finish";
        }
    }
    
    doSubmit() {
        if (!this.iDavis.config["slack"].success && this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
            //ToDo: Add redirect url and enabled=true to payload
            this.iDavis.connectSlack()
              .then(result => {
                if (result.success) {
                  //REST call to endpoint here, trigger restart of Botkit
                  this.iDavis.config["slack"].success = true;
                } else {
                  this.iDavis.config["slack"].success = false;
                  this.iDavis.config["slack"].error = result.message;
                }
              },
              error => {
                  console.log(error);
                  this.iDavis.config["slack"].success = false;
              });
            this.submitted = true;
        } else {
            this.iDavis.windowLocation(this.myURL);
        }
    }
}
