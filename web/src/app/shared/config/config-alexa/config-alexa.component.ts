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
    public iDavis: DavisService,
    public iConfig: ConfigService) { }

  validate() {
    if (this.iDavis.values.alexa_ids) {
      this.buttonText = "Continue";
    } else {
      this.buttonText = "Skip";
    }
  }

  doSubmit() {
    if (this.iDavis.values.alexa_ids) {
      this.iDavis.connectAlexa()
      .then(result => {
        this.iDavis.config["alexa"].success = true;
        this.iConfig.SelectView("slack");
      },
      error => {
      console.log(error);
      this.iDavis.config["alexa"].success = false;
    });
    } else {
      this.iConfig.SelectView("slack");
    }

    this.submitted = true;
  }
}
