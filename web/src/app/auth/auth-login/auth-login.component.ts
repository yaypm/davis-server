// ============================================================================
// Auth Login - Component
//
// This component creates a login form for authentication
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from "@angular/core";
import { Router }    from "@angular/router";
import { DavisService } from "../../shared/davis.service";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    "auth-login",
  templateUrl: "./auth-login.component.html",
})

export class AuthLoginComponent  {
  // Initialize form submission
  submitted: boolean = false;

  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public iDavis: DavisService, public router: Router) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  login() {
    this.iDavis.getJwtToken()
      .then(result => {
        if (result.success) {
          
        } else {
          // router.
        }
      });
    this.submitted = true;
  }

}
