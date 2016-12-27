// ============================================================================
// Wizard Base - COMPONENT
//
// This component creates the Wizard landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component, OnInit } from "@angular/core";

// Services
import { ConfigService } from "../../shared/config/config.service";
import { DavisService }  from "../../shared/davis.service";
import * as _ from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    "wizard-base",
  templateUrl: "./wizard-base.component.html",
})

export class WizardBaseComponent implements OnInit {
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public iConfig: ConfigService, public iDavis: DavisService) { 
    this.iDavis.titleGlobal = 'Setup';
  }
  
  ngOnInit() {
    this.iDavis.getDavisConfiguration()
      .then(result => {
        if (result.success) {
          this.iDavis.values.dynatrace.url = result.config.dynatrace.url;
          this.iDavis.values.dynatrace.token = result.config.dynatrace.token;
          this.iDavis.values.slack.clientId = result.config.slack.clientId;
          this.iDavis.values.slack.clientSecret = result.config.slack.clientSecret;
        }
      });
  }
}
