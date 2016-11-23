// ============================================================================
// App - MODULE
//
// This module handles all functionality for the application
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }       from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule }    from "@angular/forms";
import { HttpModule,
         JsonpModule }    from "@angular/http";
import { RouterModule } from "@angular/router";

// Components
import { AppComponent } from "./app.component";

// Modules
import { AuthModule }   from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { WizardModule } from "./wizard/wizard.module";

// Routing
import { AppRouting } from "./app.routing";

// Services
import { ConfigService } from "./shared/config.service";

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
    ConfigModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    WizardModule,
  ],
  providers: [
    ConfigService,
  ],
})

export class AppModule { }

