import { Component } from "@angular/core";

// Services
import { ConfigService } from "../config.service";
import { DavisService }  from "../../davis.service";

@Component({
  moduleId: module.id,
  selector: "config-alexa",
  templateUrl: "./config-alexa.component.html",
})
export class ConfigAlexaComponent {
  submitted: boolean = false;
  buttonText: string = "Skip";

  constructor(
    public davisService: DavisService,
    public iConfig: ConfigService) { }

  validate() {
    if (this.davisService.values.alexa_ids) {
      this.buttonText = "Continue";
    } else {
      this.buttonText = "Skip";
    }
  }

  doSubmit() {
    if (this.davisService.values.alexa_ids) {
      this.davisService.connectAlexa()
      .then(result => {
        this.davisService.config["alexa"].success = true;
        this.iConfig.SelectView("slack");
      },
      error => {
      console.log(error);
      this.davisService.config["alexa"].success = false;
    });
    } else {
      this.iConfig.SelectView("slack");
    }

    this.submitted = true;
  }
}
