// ============================================================================
// Auth Login - Component
//
// This component creates a login form for authentication
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component, OnInit }            from '@angular/core';
import { Router, NavigationExtras }     from '@angular/router';
import { ConfigService }                from '../../shared/config/config.service';
import { DavisService }                 from '../../shared/davis.service';
import * as _                           from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    'auth-login',
  templateUrl: './auth-login.component.html',
})

export class AuthLoginComponent  implements OnInit {
  // Initialize form submission
  submitted: boolean = false;
  loginError: string = null;
  password: string = '';
  submitButton: string = 'Sign in';

  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public iDavis: DavisService, public iConfig: ConfigService, public router: Router) {
    this.iConfig.titleGlobal = '';
  }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  login(form: any) {
    
    let navigationExtras: NavigationExtras = {
      preserveFragment: true
    };
    
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
          return this.iDavis.getDavisUser();
        } else {
          this.submitButton = 'Sign in';
          this.loginError = result.message;
          this.password = '';
        }
      })
      .then(result => {
        if (result.success) {
          this.iDavis.values.user = result.user;
          if (!result.user.name) {
            this.iDavis.values.user.name = {first:'',last:''};
          } else {
            if (!result.user.name.first) this.iDavis.values.user.name.first = '';
            if (!result.user.name.last) this.iDavis.values.user.name.last = '';
          }
          this.iDavis.values.original.user = _.cloneDeep(this.iDavis.values.user);
          this.router.navigate(['/configuration'], navigationExtras);
        } else {
          this.iConfig.generateError('user', result.message);        }
      })
      .catch(err => {
        if (JSON.stringify(err).includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
  }
  
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = false;
  }

}
