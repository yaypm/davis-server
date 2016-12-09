import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
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
    backImg: string = '/assets/img/back.svg';
    backImgHover: string = '/assets/img/back-hover.svg';
    filterName: string = '';
    
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
      this.filterName = '';
    }
    
    editMode(user: any) {
      this.editUser = true;
      this.iDavis.values.original.otherUser = user;
      this.iDavis.values.otherUser = _.cloneDeep(user);
      this.filterName = '';
    }
    
    getUsers() {
      this.iDavis.getDavisUsers()
        .then( 
          response => {
            this.iDavis.values.users = response.users;
            _.remove(this.iDavis.values.users, (user: any) => {
              return user.email === this.iDavis.values.user.email;
            });
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
    
    updateFilter(input: any) {
      this.filterName = input.value;
    }
    
    ngOnInit() {
      this.getUsers();
    }

}