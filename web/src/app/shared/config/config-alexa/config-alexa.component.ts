import { Component } from "@angular/core";
import { Router } from"@angular/router";
import { ConfigService } from "../../config.service";

@Component({
  moduleId: module.id,
  selector: "config-alexa",
  templateUrl: "./config-alexa.component.html",
})
export class ConfigAlexaComponent {
  submitted: boolean = false;
  buttonText: string = "Skip";

  constructor(public configService: ConfigService, public router: Router) {}

  validate() {
    if (this.configService.values.alexa_ids) {
      this.buttonText = "Continue";
    } else {
      this.buttonText = "Skip";
    }
  }

  doSubmit() {
    if (this.configService.values.alexa_ids) {
      this.configService.connectAlexa()
      .then(result => {
        this.configService.config["alexa"].success = true;
        this.router.navigate([this.configService.config["slack"].path]);
      },
      error => {
      console.log(error);
      this.configService.config["alexa"].success = false;
    });
    } else {
      this.router.navigate([this.configService.config["slack"].path]);
    }

    this.submitted = true;
  }
}
