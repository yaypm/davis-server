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
    
    constructor(public configService: DavisService, public router: Router) {}
    
    doSubmit() {
      this.configService.addDavisUser()
        .then(result => {
            if (result.success) {
              if (this.configService.isWizard) {
                this.configService.removeDavisUser(this.configService.values.authenticate.email)
                  .then(res => {
                      if (res.success) {
                        this.configService.config["user"].success = true;
                        
                        // Authenticate new user, update token
                        this.configService.values.authenticate.email = this.configService.values.user.email;
                        this.configService.values.authenticate.password = this.configService.values.user.password;
                        
                         this.configService.getJwtToken()
                          .then( 
                            response => {
                              this.configService.token = response.token;
                              this.router.navigate([this.configService.config["dynatrace"].path]);
                            },
                            error => {
                              this.configService.config["user"].success = false;
                              this.configService.config["user"].error = "Sorry an error occured, please try again.";
                            }
                          );
                      } else {
                        this.configService.config["user"].success = false;
                        this.configService.config["user"].error = res.message;
                      }
                  },
                  error => {
                    this.configService.config["user"].success = false;
                    this.configService.config["user"].error = "Sorry an error occured, please try again.";
                  });
                }
            } else {
              this.configService.config["user"].success = false;
              this.configService.config["user"].error = result.message;
              this.configService.values.user.email = "";
              this.configService.values.user.password = "";
            }
          },
          error => {
            this.configService.config["user"].success = false;
            this.configService.config["user"].error = "Sorry an error occured, please try again.";
          });
      this.submitted = true;
    }
    
    keySubmit(keyCode: any) {
      if (keyCode == 13) this.doSubmit();
    }
    
    ngOnInit() {
      if (this.configService.isWizard && !this.configService.token) {
        this.configService.values.authenticate.email = "admin@localhost";
        this.configService.values.authenticate.password = "changeme";
        this.configService.values.user.admin = true;
      }
      this.configService.getJwtToken()
        .then( 
          response => {
            this.configService.token = response.token;
            this.configService.getTimezones()
              .then( 
                response => {
                  this.configService.timezones = response.timezones;
                  this.configService.values.user.timezone = this.configService.getTimezone();
                },
                error => {
                  this.configService.config["user"].success = false;
                  this.configService.config["user"].error = "Unable to get timezones, please try again later.";
                }
              );
          },
          error => {
            this.configService.config["user"].success = false;
            this.configService.config["user"].error = "Sorry an error occured, please try again.";
          }
        );
    }

}