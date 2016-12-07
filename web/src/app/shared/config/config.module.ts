// ============================================================================
// Configuration - MODULE
//
// This module handles all functionality for the Configuration components
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// Components
import { ConfigAlexaComponent }     from "./config-alexa/config-alexa.component";
import { ConfigChromeComponent }    from "./config-chrome/config-chrome.component";
import { ConfigDynatraceComponent } from "./config-dynatrace/config-dynatrace.component";
import { ConfigSlackComponent }     from "./config-slack/config-slack.component";
import { ConfigUserComponent }      from "./config-user/config-user.component";
import { ConfigUsersComponent }     from "./config-users/config-users.component";

// Services
import { ConfigService } from "./config.service";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    ConfigAlexaComponent,
    ConfigChromeComponent,
    ConfigDynatraceComponent,
    ConfigSlackComponent,
    ConfigUserComponent,
    ConfigUsersComponent,
  ],
  exports: [
    ConfigAlexaComponent,
    ConfigChromeComponent,
    ConfigDynatraceComponent,
    ConfigSlackComponent,
    ConfigUserComponent,
    ConfigUsersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    ConfigService,
  ],
})

export class ConfigModule { }
