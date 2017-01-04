// ============================================================================
// App - COMPONENT
//
// This component is the foundation of the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Http, Headers }      from '@angular/http';
import { Component }          from "@angular/core";
import { Router }             from "@angular/router";

// Third party
import "./rxjs-operators";
import { ConfigService }      from "./shared/config/config.service";
import { DavisService }       from "./shared/davis.service";

declare var dT_ : any;

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    "davis",
  templateUrl: "./app.component.html",
})

export class AppComponent {
  isUserMenuVisible: boolean = false;

  constructor(
    public iConfig: ConfigService, 
    public iDavis: DavisService, 
    public http: Http,
    public router: Router) {
      // Dynatrace Angular2 instrumentation (optional)
      if(typeof dT_!='undefined' && dT_.initAngularNg){
        dT_.initAngularNg(http, Headers);
      }
    }
  
  toggleUserMenu() {
    this.isUserMenuVisible = !this.isUserMenuVisible;
  }
}
