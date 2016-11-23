import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "../../shared/config.service";

@Component({
    moduleId: module.id,
    selector: "wizard",
    templateUrl: "./wizard.component.html",
})
export class WizardComponent {
  view: string = "user";

  constructor(private configService: ConfigService, private router: Router) {}

  SelectView(newView: string) {
    view = newView;
  }
}
