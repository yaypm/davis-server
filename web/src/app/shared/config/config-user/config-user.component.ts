import { Component, OnInit,
         AfterViewInit,
         ElementRef,
         Renderer,
         ViewChild,
         Input, Output, 
         EventEmitter }           from '@angular/core';

// Services
import { ConfigService }          from '../config.service';
import { DavisService }           from '../../davis.service';
import { DavisModel }             from '../../models/davis.model';
import * as _                     from 'lodash';

@Component({
  selector: 'config-user',
  templateUrl: './config-user.component.html',
})
export class ConfigUserComponent implements OnInit, AfterViewInit {

  @Input() isMyUser: boolean;
  @Input() isNewUser: boolean;
  @Output() showUsersList: EventEmitter<any> = new EventEmitter();
  @ViewChild('first') first: ElementRef;

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
    private renderer: Renderer,
    public iDavis: DavisService,
    public iConfig: ConfigService) {}

  doSubmit() {
    this.submitted = true;
    this.submitButton = (this.isNewUser) ? 'Adding User...' : 'Saving...';
    
    // // Safari autocomplete polyfill - https://github.com/angular/angular.js/issues/1460
    if (!this.iConfig.isWizard && !this.isMyUser) {
      this.iConfig.values.otherUser.name.first = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.name.first, 'first');
      this.iConfig.values.otherUser.name.last = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.name.last, 'last');
      this.iConfig.values.otherUser.email = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.email, 'email');
      this.iConfig.values.otherUser.admin = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.admin, 'admin');
      this.iConfig.values.otherUser.timezone = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.timezone, 'timezone');
      this.iConfig.values.otherUser.alexa_ids = this.iDavis.safariAutoCompletePolyFill(this.iConfig.values.otherUser.alexa_ids, 'alexa_ids');
    } else {
      this.iDavis.values.user.name.first = this.iDavis.safariAutoCompletePolyFill(this.iDavis.values.user.name.first, 'first');
      this.iDavis.values.user.name.last = this.iDavis.safariAutoCompletePolyFill(this.iDavis.values.user.name.last, 'last');
      this.iDavis.values.user.email = this.iDavis.safariAutoCompletePolyFill(this.iDavis.values.user.email, 'email');
      this.iDavis.values.user.timezone = this.iDavis.safariAutoCompletePolyFill(this.iDavis.values.user.timezone, 'timezone');
      this.iDavis.values.user.alexa_ids = this.iDavis.safariAutoCompletePolyFill(this.iDavis.values.user.alexa_ids, 'alexa_ids');
    }
    
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
                this.submitButton = this.submitButtonDefault;
              });
            
          } else {
             this.iConfig.values.original.otherUser = _.cloneDeep(this.user);
             this.showUsersList.emit();
          }
      })
      .catch(err => {
        this.iConfig.displayError(err, 'user');
        this.submitButton = this.submitButtonDefault;
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
    if (this.iDavis.values.user.alexa_ids.length < 1 || this.iDavis.values.user.alexa_ids[0].trim().length < 1) {
      this.iDavis.values.user.alexa_ids = [];
    }
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
      this.submitButton = 'Add User';
    }

    this.detectedTimezone = this.iDavis.getTimezone();
    if (this.iConfig.isWizard) {
      this.iDavis.values.user.timezone = this.iDavis.getTimezone();
    } else if (this.isNewUser){
      this.iConfig.values.otherUser.timezone = this.iDavis.getTimezone();
    }
  }
  
  ngAfterViewInit() {
    if (this.isNewUser) {
      this.renderer.invokeElementMethod(this.first.nativeElement, 'focus');
    }
    this.validate();
  }
}
