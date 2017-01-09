import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Services
import { ConfigService }          from '../config.service';
import { DavisService }           from '../../davis.service';
import { DavisModel }             from '../../models/davis.model';
import * as _                     from 'lodash';

@Component({
  selector: 'config-user',
  templateUrl: './config-user.component.html',
})
export class ConfigUserComponent implements OnInit {

  @Input() isMyUser: boolean;
  @Input() isNewUser: boolean;
  @Output() showUsersList: EventEmitter<any> = new EventEmitter();

  submitted: boolean = false;
  submitButton: string = (this.iConfig.isWizard) ? 'Continue' : 'Save';
  submitButtonDefault: string = (this.iConfig.isWizard) ? 'Continue' : 'Save';
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
    this.user = (!this.iConfig.isWizard && !this.isMyUser) ? this.iConfig.values.otherUser : this.iDavis.values.user;
    
    if ((!this.iConfig.isWizard && !this.isNewUser) || (!this.iConfig.isWizard && this.isMyUser)) {
      this.iConfig.updateDavisUser(this.user)
        .then(response => {
          if (!response.success) throw new Error(response.message);
          
          this.iConfig.values.original.user = _.cloneDeep(this.user);
          this.isDirty = false;
          this.iConfig.status['user'].success = true;
          this.submitButton = 'Save';
          if (!this.isMyUser) {
            this.showUsersList.emit();
          }
        })
        .catch(err => {
          this.iConfig.displayError(err, 'user');
        });
    } else {
      this.iConfig.addDavisUser(this.user)
        .then(response => {
          if (!response.success) throw new Error(response.message);
          
          this.submitButton = this.submitButtonDefault;
          this.iConfig.status['user'].success = true;
          this.iConfig.status['user'].error = null;
          this.iConfig.values.otherUser = new DavisModel().config.values.otherUser;
          
          this.iConfig.values.otherUser.timezone = this.iDavis.getTimezone();
          this.iConfig.values.original.otherUser = _.cloneDeep(this.iConfig.values.otherUser);
          
          if (this.iConfig.isWizard) {
            
            this.iConfig.values.original.user = _.cloneDeep(this.user);
            this.isDirty = false;
            
            // Authenticate new user, update token
            this.iDavis.values.authenticate.email = this.iDavis.values.user.email;
            this.iDavis.values.authenticate.password = this.iDavis.values.user.password;
            this.iDavis.getJwtToken()
              .then(
                response => {
                  if (!response.success) throw new Error(response.message);
                  
                  this.iDavis.token = response.token;
                  this.iConfig.selectView('alexa');
                  sessionStorage.setItem('email', this.iDavis.values.user.email);
                  sessionStorage.setItem('token', response.token);
                  sessionStorage.setItem('isAdmin', response.admin);
                  this.submitButton = this.submitButtonDefault;
                  
                  // Delete admin@localhost user
                  this.deleteUser('admin@localhost');
              })
              .catch(err => {
                this.iConfig.displayError(err, 'user');
              });
            
          } else {
             this.iConfig.values.original.otherUser = _.cloneDeep(this.user);
             this.showUsersList.emit();
          }
      })
      .catch(err => {
        this.iConfig.displayError(err, 'user');
      });
    }
  }

  deleteUser(email: string) {
    if (this.confirmDeleteUser) {
      this.iConfig.removeDavisUser(email)
        .then(response => {
          if (!response.success) throw new Error(response.message);
          
          this.isDirty = false;
          this.iConfig.status['user'].success = true;
          this.confirmDeleteUser = false;
          this.showUsersList.emit();
        })
        .catch(err => {
          this.iConfig.displayError(err, 'user');
        });
    } else {
      this.confirmDeleteUser = true;
    }
  }

  validate() {
    this.isDirty = (this.isMyUser) ? !_.isEqual(this.iDavis.values.user, this.iConfig.values.original.user) : !_.isEqual(this.iConfig.values.otherUser, this.iConfig.values.original.otherUser);
  }

  onTimezoneChange(tz: string) {
    if (this.isMyUser) {
       this.iDavis.values.user.timezone = tz;
    } else {
       this.iConfig.values.otherUser.timezone = tz;
    }
  }

  ngOnInit() {
    if (this.isNewUser) {
      this.submitButtonDefault = 'Add User';
    }

    this.detectedTimezone = this.iDavis.getTimezone();
    if (this.iConfig.isWizard) {
      this.iDavis.values.user.timezone = this.iDavis.getTimezone();
    } else if (this.isNewUser){
      this.iConfig.values.otherUser.timezone = this.iDavis.getTimezone();
    }
     
    setTimeout(() => {
      if (document.getElementsByName('first')[0]) {
        document.getElementsByName('first')[0].focus();
      }
      this.validate();
    }, 200);
  }
}
