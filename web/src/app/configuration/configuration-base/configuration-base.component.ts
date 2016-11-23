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
  constructor(public router: Router) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    
  }
}
