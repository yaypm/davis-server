// ============================================================================
// App - COMPONENT
//
// This component is the foundation of the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Http, Headers }        from "@angular/http";
import { Component,
         AfterViewInit }        from "@angular/core";
import { Router }               from "@angular/router";

// Third party
import "./rxjs-operators";
import { ConfigService }        from "./shared/config/config.service";
import { DavisService }         from "./shared/davis.service";

declare var dT_ : any;

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    "body",
  templateUrl: "./app.component.html",
  host: {'[class.theme--dark]':'!iDavis.isAuthenticated && !iConfig.isWizard', '[class.theme--blue]':'iDavis.isAuthenticated || iConfig.isWizard'},
})

export class AppComponent {
  
  constructor(
    public iConfig: ConfigService, 
    public iDavis: DavisService, 
    public http: Http,
    public router: Router) {
      // Dynatrace Angular2 instrumentation (optional)
      if(typeof dT_!='undefined' && dT_.initAngularNg){
        dT_.initAngularNg(http, Headers);
      }
      
      // Detect embedding in Dynatrace iFrame tile
      this.iDavis.isIframeTile = this.iDavis.isIframeTileDetected();
      this.iDavis.windowScrolled();
    }

}