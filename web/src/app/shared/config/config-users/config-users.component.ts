import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { DavisService } from "../../davis.service";

@Component({
    moduleId: module.id,
    selector: "config-users",
    templateUrl: "./config-users.component.html",
})
export class ConfigUsersComponent implements OnInit {
    
    submitted: boolean = false;
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isSelectOpened: boolean = false;
    
    constructor(public iDavis: DavisService, public router: Router) {}
    
    doSubmit() {
      
      this.submitted = true;
    }
    
    ngOnInit() {
     
    }

}