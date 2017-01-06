// ============================================================================
// App - COMPONENT
//
// This component is the foundation of the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
<<<<<<< HEAD
import { Http, Headers }        from '@angular/http';
import { Component }            from "@angular/core";
import { Router }               from "@angular/router";

// Third party
import "./rxjs-operators";
import { ConfigService }        from "./shared/config/config.service";
import { DavisService }         from "./shared/davis.service";
=======
import { Http, Headers }      from '@angular/http';
import { Component }          from "@angular/core";
import { Router }             from "@angular/router";

// Third party
import "./rxjs-operators";
import { ConfigService }      from "./shared/config/config.service";
import { DavisService }       from "./shared/davis.service";
>>>>>>> 58383a12a776e0a623415edca0df2949f9581a9f

declare var dT_ : any;

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    "davis",
  templateUrl: "./app.component.html",
})

export class AppComponent {

  constructor(
    public iConfig: ConfigService, 
    public iDavis: DavisService, 
    public http: Http,
    public router: Router) {
      // Dynatrace Angular2 instrumentation (optional)
<<<<<<< HEAD
      // if(typeof dT_!='undefined' && dT_.initAngularNg){
      //   dT_.initAngularNg(http, Headers);
      // }
    }

=======
      if(typeof dT_!='undefined' && dT_.initAngularNg){
        dT_.initAngularNg(http, Headers);
      }
    }
  
  toggleUserMenu() {
    this.isUserMenuVisible = !this.isUserMenuVisible;
  }
>>>>>>> 58383a12a776e0a623415edca0df2949f9581a9f
}
