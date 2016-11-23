import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfigService } from "../../config.service";

@Component({
  moduleId: module.id,
  selector: "config-dynatrace",
  templateUrl: "./config-dynatrace.component.html",
})
export class ConfigDynatraceComponent {

  submitted: boolean = false;
    
  constructor(public configService: ConfigService, public router: Router) {}
  
  doSubmit() {
    this.configService.connectDynatrace()
        .then(result => {
          if (result.success) {
            this.configService.validateDynatrace()
            .then(res => {
              if (res.success) {
                this.configService.config["dynatrace"].success = true;
                this.router.navigate([this.configService.config["alexa"].path]);
              } else {
                this.configService.config["dynatrace"].success = false;
                this.configService.config["dynatrace"].error = res.message;
              }
            },
            err => {
              this.configService.config["dynatrace"].success = false;
              this.configService.config["dynatrace"].error = "Sorry an error occured, please try again.";
            });
          } else {
            this.configService.config["dynatrace"].success = false;
            this.configService.config["dynatrace"].error = result.message;
          }
        },
        error => {
          this.configService.config["dynatrace"].success = false;
          this.configService.config["dynatrace"].error = "Sorry an error occured, please try again.";
        });
    this.submitted = true;
  }
  
  keySubmit(keyCode: any) {
    if (keyCode == 13) this.doSubmit();
  }
}
