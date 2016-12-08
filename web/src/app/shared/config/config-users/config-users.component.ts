import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
    moduleId: module.id,
    selector: 'config-users',
    templateUrl: './config-users.component.html',
})
export class ConfigUsersComponent implements OnInit {
    
    submitted: boolean = false;
    submitButton: string = 'Save';
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    addUser: boolean = true;
    editUser: boolean = false;
    users: any = [];
    
    constructor(public iDavis: DavisService, public router: Router) {}
    
    addMode() {
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
    }
    
    editMode(user: any) {
      this.editUser = true;
      this.iDavis.values.original.otherUser = user;
      this.iDavis.values.otherUser = _.cloneDeep(user);
    }
    
    getUsers() {
      this.iDavis.getDavisUsers()
        .then( 
          response => {
            this.iDavis.values.users = response.users;
            this.users = _.cloneDeep(response.users);
          },
          error => {
            this.iDavis.config['users'].success = false;
            this.iDavis.config['users'].error = 'Unable to get users, please try again later.';
          })
          .catch(err => {
            if (err.includes('invalid token')) {
              this.iDavis.logOut();
            }
          });
    }
    
    ngOnInit() {
      this.getUsers();
    }

}