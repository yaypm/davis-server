import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { DavisService } from "../../davis.service";

@Component({
    moduleId: module.id,
    selector: "config-user",
    templateUrl: "./config-user.component.html",
})
export class ConfigUserComponent implements OnInit {
    
    submitted: boolean = false;
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isSelectOpened: boolean = false;
    
    constructor(public davisService: DavisService, public router: Router) {}
    
    doSubmit() {
      this.davisService.addDavisUser()
        .then(result => {
            if (result.success) {
              if (this.davisService.isWizard) {
                this.davisService.removeDavisUser(this.davisService.values.authenticate.email)
                  .then(res => {
                      if (res.success) {
                        this.davisService.config["user"].success = true;
                        
                        // Authenticate new user, update token
                        this.davisService.values.authenticate.email = this.davisService.values.user.email;
                        this.davisService.values.authenticate.password = this.davisService.values.user.password;
                        
                         this.davisService.getJwtToken()
                          .then( 
                            response => {
                              this.davisService.token = response.token;
                              this.router.navigate([this.davisService.config["dynatrace"].path]);
                            },
                            error => {
                              this.davisService.config["user"].success = false;
                              this.davisService.config["user"].error = "Sorry an error occured, please try again.";
                            }
                          );
                      } else {
                        this.davisService.config["user"].success = false;
                        this.davisService.config["user"].error = res.message;
                      }
                  },
                  error => {
                    this.davisService.config["user"].success = false;
                    this.davisService.config["user"].error = "Sorry an error occured, please try again.";
                  });
                }
            } else {
              this.davisService.config["user"].success = false;
              this.davisService.config["user"].error = result.message;
              this.davisService.values.user.email = "";
              this.davisService.values.user.password = "";
            }
          },
          error => {
            this.davisService.config["user"].success = false;
            this.davisService.config["user"].error = "Sorry an error occured, please try again.";
          });
      this.submitted = true;
    }
    
    ngOnInit() {
      if (this.davisService.isWizard && !this.davisService.token) {
        this.davisService.values.authenticate.email = "admin@localhost";
        this.davisService.values.authenticate.password = "changeme";
        this.davisService.values.user.admin = true;
      }
      this.davisService.getJwtToken()
        .then( 
          response => {
            this.davisService.token = response.token;
            this.davisService.getTimezones()
              .then( 
                response => {
                  this.davisService.timezones = response.timezones;
                  this.davisService.values.user.timezone = this.davisService.getTimezone();
                },
                error => {
                  this.davisService.config["user"].success = false;
                  this.davisService.config["user"].error = "Unable to get timezones, please try again later.";
                }
              );
          },
          error => {
            this.davisService.config["user"].success = false;
            this.davisService.config["user"].error = "Sorry an error occured, please try again.";
          }
        );
    }

}