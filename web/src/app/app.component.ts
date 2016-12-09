// ============================================================================
// App - COMPONENT
//
// This component is the foundation of the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Third party
import "./rxjs-operators";
import { DavisService } from "./shared/davis.service";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    "davis",
  templateUrl: "./app.component.html",
})

export class AppComponent { 
  constructor(public iDavis: DavisService, public router: Router) {}
}
