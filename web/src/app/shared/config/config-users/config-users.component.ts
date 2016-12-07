import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DavisService } from '../../davis.service';

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
    users: any = [
      {
        name:
        {
          first: 'John',
          last: 'Smith'
        },
        email: 'john.smith@example.com',
        admin: false
      },    
      {
        name:
        {
          first: 'Tom',
          last: 'Green'
        },
        email: 'tom.green@example.com',
        admin: true
      },   
      {
        name:
        {
          first: 'Mike',
          last: 'Johnson'
        },
        email: 'mike.johnson@example.com',
        admin: false
      },
      {
        name:
        {
          first: 'Lisa',
          last: 'Lopez'
        },
        email: 'lisa.lopez@example.com',
        admin: true
      },   
    ];
    
    constructor(public iDavis: DavisService, public router: Router) {}
    
    doSubmit() {
      this.submitted = true;
      this.submitButton = 'Saving...';
    }
    
    ngOnInit() {
     
    }

}