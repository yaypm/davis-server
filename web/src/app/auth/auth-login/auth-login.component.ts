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
  constructor(public router: Router) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    
  }

}
