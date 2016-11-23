// ============================================================================
// Config Base - Component
//
// This component creates Configuration landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from "@angular/core";
import { Router }    from "@angular/router";
import { ConfigService } from "../../shared/config/config.service";
import { DavisService } from "../../shared/davis.service";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    "configuration-base",
  templateUrl: "./configuration-base.component.html",
})

export class ConfigurationBaseComponent  {
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public router: Router, public iConfig: ConfigService) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    
  }
}
