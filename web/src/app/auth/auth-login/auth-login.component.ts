// ============================================================================
// Auth Login - Component
//
// This component creates a login form for authentication
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { DavisService } from '../../shared/davis.service';

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    'auth-login',
  templateUrl: './auth-login.component.html',
})

export class AuthLoginComponent  {
  // Initialize form submission
  submitted: boolean = false;
  loginError: string = null;
  password: string = '';
  submitButton: string = 'Sign in';

  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public iDavis: DavisService, public router: Router) {
    this.iDavis.titleGlobal = '';
  }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  login(form: any) {
    this.submitted = true;
    this.submitButton = 'Signing in...';
    this.iDavis.values.authenticate.email = form.value.email;
    this.iDavis.values.authenticate.password = form.value.password;
    this.iDavis.getJwtToken()
      .then(result => {
        if (result.success) {
          this.submitButton = 'Sign in';
          this.loginError = null;
          this.iDavis.token = result.token;
          this.iDavis.isAuthenticated = true;
          this.iDavis.isAdmin = result.admin;
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('isAdmin');
          sessionStorage.setItem('email', form.value.email);
          sessionStorage.setItem('token', result.token);
          sessionStorage.setItem('isAdmin', result.admin);
          this.router.navigate(['/configuration']);
        } else {
          this.submitButton = 'Sign in';
          this.loginError = result.message;
          this.password = '';
        }
      });
  }

}
