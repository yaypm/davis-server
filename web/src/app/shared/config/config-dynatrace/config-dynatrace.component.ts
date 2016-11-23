import { Component } from "@angular/core";

// Services
import { ConfigService } from "../config.service";
import { DavisService } from "../../davis.service";

@Component({
  moduleId: module.id,
  selector: "config-dynatrace",
  templateUrl: "./config-dynatrace.component.html",
})
export class ConfigDynatraceComponent {

  submitted: boolean = false;
    
  constructor(
    public davisService: DavisService,
    public iConfig: ConfigService) { }
  
  doSubmit() {
    this.davisService.connectDynatrace()
        .then(result => {
          if (result.success) {
            this.davisService.validateDynatrace()
            .then(res => {
              if (res.success) {
                this.davisService.config["dynatrace"].success = true;
                this.iConfig.SelectView("alexa");
              } else {
                this.davisService.config["dynatrace"].success = false;
                this.davisService.config["dynatrace"].error = res.message;
              }
            },
            err => {
              this.davisService.config["dynatrace"].success = false;
              this.davisService.config["dynatrace"].error = "Sorry an error occured, please try again.";
            });
          } else {
            this.davisService.config["dynatrace"].success = false;
            this.davisService.config["dynatrace"].error = result.message;
          }
        },
        error => {
          this.davisService.config["dynatrace"].success = false;
          this.davisService.config["dynatrace"].error = "Sorry an error occured, please try again.";
        });
    this.submitted = true;
  }
  
  keySubmit(keyCode: any) {
    if (keyCode === 13) {
      this.doSubmit();
    }
  }
}
