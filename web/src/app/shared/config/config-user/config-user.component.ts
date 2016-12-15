import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  
    @Input() isMyUser: boolean;
    @Input() isNewUser: boolean;
    @Output() showUsersList: EventEmitter<any> = new EventEmitter();
    
    submitted: boolean = false;
    submitButton: string = (this.iDavis.isWizard) ? 'Continue' : 'Save';
    submitButtonDefault: string = (this.iDavis.isWizard) ? 'Continue' : 'Save';
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isSelectOpened: boolean = false;
    isDirty: boolean = false;
    detectedTimezone: string = '';
    confirmDeleteUser: boolean = false;
    user: any;
    
    constructor(
      public iDavis: DavisService,
      public iConfig: ConfigService) {}
    
    doSubmit() {
      this.submitted = true;
      this.submitButton = 'Saving...';
      this.user = (!this.iDavis.isWizard && !this.isMyUser) ? this.iDavis.values.otherUser : this.iDavis.values.user;
      
      if ((!this.iDavis.isWizard && !this.isNewUser) || (!this.iDavis.isWizard && this.isMyUser)) {
        this.iDavis.updateDavisUser(this.user)
          .then(result => {
              if (result.success) {
                this.iDavis.values.original.user = _.cloneDeep(this.user);
                this.isDirty = false;
                this.iDavis.config['user'].success = true;
                this.submitButton = 'Save';
                if (!this.isMyUser) {
                  this.showUsersList.emit();
                }
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
        this.iDavis.addDavisUser(this.user)
          .then(result => {
              if (result.success) {
                this.submitButton = this.submitButtonDefault;
                this.iDavis.config['user'].success = true;
                this.iDavis.config['user'].error = null;
                this.iDavis.values.otherUser = {
                  email: null,
                  password: null,
                  timezone: null,
                  alexa_ids: null,
                  name: {
                      first: null,
                      last: null
                  },
                  admin: false
                };
                this.iDavis.values.otherUser.timezone = this.iDavis.getTimezone();
                this.iDavis.values.original.otherUser = _.cloneDeep(this.iDavis.values.otherUser);
                if (this.iDavis.isWizard) {
                  this.iDavis.values.original.user = _.cloneDeep(this.user);
                  this.isDirty = false;
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
                                  this.iConfig.SelectView('alexa');
                                  this.submitButton = this.submitButtonDefault;
                                  sessionStorage.setItem('email', this.iDavis.values.user.email);
                                  sessionStorage.setItem('token', response.token);
                                  sessionStorage.setItem('isAdmin', response.admin);
                                },
                                error => {
                                  this.iDavis.config['user'].success = false;
                                  this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                                  this.submitButton = this.submitButtonDefault;
                                }
                              );
                      
                        } else {
                          this.iDavis.config['user'].success = false;
                          this.iDavis.config['user'].error = res.message;
                          this.submitButton = this.submitButtonDefault;
                        }
                    },
                    error => {
                      this.iDavis.config['user'].success = false;
                      this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                      this.submitButton = this.submitButtonDefault;
                    });
                } else {
                   this.iDavis.values.original.otherUser = _.cloneDeep(this.user);
                   this.showUsersList.emit();
                }
              } else {
                this.iDavis.config['user'].success = false;
                this.iDavis.config['user'].error = result.message;
                this.iDavis.values.user.email = '';
                this.iDavis.values.user.password = '';
                this.submitButton = this.submitButtonDefault;
              }
            },
            error => {
              this.iDavis.config['user'].success = false;
              this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
              this.submitButton = this.submitButtonDefault;
            });
      }
    }
    
    deleteUser(email: string) {
      if (this.confirmDeleteUser) {
        this.iDavis.removeDavisUser(email)
          .then(result => {
              if (result.success) {
                this.isDirty = false;
                this.iDavis.config['user'].success = true;
                this.confirmDeleteUser = false;
                this.showUsersList.emit();
              } else {
                this.confirmDeleteUser = false;
                this.iDavis.config['user'].success = false;
                this.iDavis.config['user'].error = result.message;
              }
            },
            error => {
              this.confirmDeleteUser = false;
              this.iDavis.config['user'].success = false;
              this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
            });
      } else {
        this.confirmDeleteUser = true;
      }
    }
    
    validate() {
      this.isDirty = (this.isMyUser) ? !_.isEqual(this.iDavis.values.user, this.iDavis.values.original.user) : !_.isEqual(this.iDavis.values.otherUser, this.iDavis.values.original.otherUser);
    }
    
    onTimezoneChange(tz: string) {
      if (this.isMyUser) {
         this.iDavis.values.user.timezone = tz;
      } else {
         this.iDavis.values.otherUser.timezone = tz;
      }
    }
    
    ngOnInit() {
      if (this.isNewUser) {
        this.submitButtonDefault = 'Add User';
      }
      this.iDavis.getTimezones()
        .then( 
          response => {
            this.detectedTimezone = this.iDavis.getTimezone();
            this.iDavis.timezones = response.timezones;
            if (this.iDavis.isWizard) {
              this.iDavis.values.user.timezone = this.iDavis.getTimezone();
            } else if (this.isNewUser){
              this.iDavis.values.otherUser.timezone = this.iDavis.getTimezone();
            }
          },
          error => {
            this.iDavis.config['user'].success = false;
            this.iDavis.config['user'].error = 'Unable to get timezones, please try again later.';
          })
          .catch(err => {
            if (err.includes('invalid token')) {
              this.iDavis.logOut();
            }
          });
      setTimeout(() => {
        if (document.getElementsByName('first')[0]) {
          document.getElementsByName('first')[0].focus();
        }
        this.validate();
      }, 200);
    }
}