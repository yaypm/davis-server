import { Component, OnInit, Input } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
    moduleId: module.id,
    selector: 'config-user',
    templateUrl: './config-user.component.html',
})
export class ConfigUserComponent implements OnInit {
  
    @Input() isMyAccount: boolean;
    
    submitted: boolean = false;
    submitButton: string = (this.iDavis.isWizard) ? 'Continue' : 'Save';
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isSelectOpened: boolean = false;
    isDirty: boolean = false;
    
    constructor(
      public iDavis: DavisService,
      public iConfig: ConfigService) {}
    
    doSubmit() {
      this.submitted = true;
      this.submitButton = 'Saving...';
      if (this.isMyAccount && !this.iDavis.isWizard) {
        this.iDavis.updateDavisUser()
          .then(result => {
              if (result.success) {
                this.iDavis.config['user'].success = true;
                this.submitButton = 'Save';
              } else {
                this.submitButton = 'Save';
                this.iDavis.config['user'].success = false;
                this.iDavis.config['user'].error = result.message;
              }
            },    
            error => {
              this.submitButton = 'Save';
              this.iDavis.config['user'].success = false;
              this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
            });
      } else {
        this.iDavis.addDavisUser()
          .then(result => {
              if (result.success) {
                if (this.iDavis.isWizard) {
                  this.iDavis.removeDavisUser(this.iDavis.values.authenticate.email)
                    .then(res => {
                        if (res.success) {
                          this.iDavis.config['user'].success = true;
                          
                          // Authenticate new user, update token
                          this.iDavis.values.authenticate.email = this.iDavis.values.user.email;
                          this.iDavis.values.authenticate.password = this.iDavis.values.user.password;
                          
                           this.iDavis.getJwtToken()
                            .then( 
                              response => {
                                this.iDavis.token = response.token;
                                this.iConfig.SelectView('dynatrace');
                                this.submitButton = 'Continue';
                                localStorage.setItem('email', this.iDavis.values.user.email);
                                localStorage.setItem('token', response.token);
                                localStorage.setItem('isAdmin', response.admin);
                              },
                              error => {
                                this.iDavis.config['user'].success = false;
                                this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                                this.submitButton = 'Continue';
                              }
                            );
                        } else {
                          this.iDavis.config['user'].success = false;
                          this.iDavis.config['user'].error = res.message;
                          this.submitButton = 'Continue';
                        }
                    },
                    error => {
                      this.iDavis.config['user'].success = false;
                      this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                      this.submitButton = 'Continue';
                    });
                  }
              } else {
                this.iDavis.config['user'].success = false;
                this.iDavis.config['user'].error = result.message;
                this.iDavis.values.user.email = '';
                this.iDavis.values.user.password = '';
                this.submitButton = 'Continue';
              }
            },
            error => {
              this.iDavis.config['user'].success = false;
              this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
              this.submitButton = 'Continue';
            });
      }
    }
    
    validate() {
      this.isDirty = !_.isEqual(this.iDavis.values.user, this.iDavis.values.original.user);
    }
    
    ngOnInit() {
      document.getElementsByName('first')[0].focus();
      this.iDavis.getTimezones()
        .then( 
          response => {
            this.iDavis.timezones = response.timezones;
            this.iDavis.values.user.timezone = this.iDavis.getTimezone();
          },
          error => {
            this.iDavis.config['user'].success = false;
            this.iDavis.config['user'].error = 'Unable to get timezones, please try again later.';
          });
      setTimeout(() => {
        this.validate();
      }, 200);
    }
}