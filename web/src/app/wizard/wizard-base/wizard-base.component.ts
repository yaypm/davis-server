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
    this.iConfig.titleGlobal = 'Setup';
  }
  
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = true;
    this.iConfig.getDavisConfiguration()
      .then(result => {
        if (result.success) {
          this.iConfig.values.dynatrace.url = result.config.dynatrace.url;
          this.iConfig.values.dynatrace.token = result.config.dynatrace.token;
          this.iConfig.values.slack.clientId = result.config.slack.clientId;
          this.iConfig.values.slack.clientSecret = result.config.slack.clientSecret;
        }
      });
  }
}
