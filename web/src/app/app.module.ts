// ============================================================================
// App - MODULE
//
// This module handles all functionality for the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule }   from "@angular/forms";
import { HttpModule,
         JsonpModule }   from "@angular/http";
import { RouterModule }  from "@angular/router";

// Components
import { AppComponent } from "./app.component";

// Modules
import { AuthModule }          from "./auth/auth.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { WizardModule }        from "./wizard/wizard.module";

// Routing
import { AppRouting } from "./app.routing";

// Services
import { ConfigGuard }  from "./auth/auth-guard/config-guard.service";
import { WizardGuard }  from "./auth/auth-guard/wizard-guard.service";
import { DavisService } from "./shared/davis.service";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,
    AppRouting,
    BrowserModule,
    ConfigurationModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    WizardModule,
  ],
  providers: [
    ConfigGuard,
    WizardGuard,
    DavisService,
  ],
})

export class AppModule { }

