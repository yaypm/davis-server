import { Component, OnInit, Input } from "@angular/core";

// Services
import { ConfigService } from "../config.service";
import { DavisService } from "../../davis.service";

@Component({
    moduleId: module.id,
    selector: "config-user",
    templateUrl: "./config-user.component.html",
})
export class ConfigUserComponent implements OnInit {
  
    @Input() isWizard: boolean;
    
    submitted: boolean = false;
    isPasswordFocused: boolean = false;
    isPasswordMasked: boolean = true;
    isSelectOpened: boolean = false;
    
    constructor(
      public iDavis: DavisService,
      public iConfig: ConfigService) {}
    
    doSubmit() {
      this.submitted = true;
      this.iDavis.addDavisUser()
        .then(result => {
            if (result.success) {
              if (this.iDavis.isWizard) {
                this.iDavis.removeDavisUser(this.iDavis.values.authenticate.email)
                  .then(res => {
                      if (res.success) {
                        this.iDavis.config["user"].success = true;
                        
                        // Authenticate new user, update token
                        this.iDavis.values.authenticate.email = this.iDavis.values.user.email;
                        this.iDavis.values.authenticate.password = this.iDavis.values.user.password;
                        
                         this.iDavis.getJwtToken()
                          .then( 
                            response => {
                              this.iDavis.token = response.token;
                              this.iConfig.SelectView("dynatrace");
                            },
                            error => {
                              this.iDavis.config["user"].success = false;
                              this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
                            }
                          );
                      } else {
                        this.iDavis.config["user"].success = false;
                        this.iDavis.config["user"].error = res.message;
                      }
                  },
                  error => {
                    this.iDavis.config["user"].success = false;
                    this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
                  });
                }
            } else {
              this.iDavis.config["user"].success = false;
              this.iDavis.config["user"].error = result.message;
              this.iDavis.values.user.email = "";
              this.iDavis.values.user.password = "";
            }
          },
          error => {
            this.iDavis.config["user"].success = false;
            this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
          });
    }
    
    ngOnInit() {
     
      this.iDavis.getTimezones()
        .then( 
          response => {
            this.iDavis.timezones = response.timezones;
            this.iDavis.values.user.timezone = this.iDavis.getTimezone();
          },
          error => {
            this.iDavis.config["user"].success = false;
            this.iDavis.config["user"].error = "Unable to get timezones, please try again later.";
          });
    }

}