import { Component } from "@angular/core";
import { DavisService } from "../../davis.service";

@Component({
  moduleId: module.id,
  selector: "config-alexa",
  templateUrl: "./config-alexa.component.html",
})
export class ConfigAlexaComponent {
  submitted: boolean = false;
  buttonText: string = "Skip";

  constructor(public davisService: DavisService) {}

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
        // this.router.navigate([this.davisService.config["slack"].path]);
      },
      error => {
      console.log(error);
      this.davisService.config["alexa"].success = false;
    });
    } else {
      // this.router.navigate([this.davisService.config["slack"].path]);
    }

    this.submitted = true;
  }
}
