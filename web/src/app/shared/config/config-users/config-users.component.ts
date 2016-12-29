import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";

@Component({
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
    
    constructor(public iDavis: DavisService, public iConfig: ConfigService, public router: Router) {}
    
    addMode() {
      this.iConfig.values.otherUser = {
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
      this.iConfig.values.otherUser.timezone = this.iDavis.getTimezone();
      this.iConfig.values.original.otherUser = _.cloneDeep(this.iConfig.values.otherUser);
      this.filterName = '';
    }

    editMode(user: any) {
      this.editUser = true;
      this.iConfig.values.original.otherUser = user;
      this.iConfig.values.otherUser = _.cloneDeep(user);
      this.filterName = '';
    }

    getUsers() {
      this.iConfig.getDavisUsers()
        .then(response => {
          this.iConfig.values.users = response.users;
          _.remove(this.iConfig.values.users, (user: any) => {
            return user.email === this.iDavis.values.user.email;
          });
          this.iConfig.values.users.forEach( (user: any, index: number) => {
            if (!user.name) {
              this.iConfig.values.users[index].name = {first:'',last:''};
            } else {
              if (!user.name.first) this.iConfig.values.users[index].name.first = '';
              if (!user.name.last) this.iConfig.values.users[index].name.last = '';
            }
          });
          this.users = _.cloneDeep(response.users);
        },
        error => {
          console.log(error);
          this.iConfig.generateError('users', null);
        })
        .catch(err => {
          if (JSON.stringify(err).includes('invalid token')) {
            this.iDavis.logOut();
          }
        });
    }

    showUsers() {
      this.getUsers();
      this.addUser = false;
      this.editUser = false;
      this.iConfig.values.original.otherUser.first = null;
    }

    updateFilter(input: any) {
      this.filterName = input.value;
    }

    ngOnInit() {
      this.getUsers();
      this.iConfig.values.otherUser = {
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
    }

}
