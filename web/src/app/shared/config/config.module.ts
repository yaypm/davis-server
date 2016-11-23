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
import { FormsModule }    from "@angular/forms";

// Components
import { ConfigAlexaComponent }     from "./config-alexa/config-alexa.component";
import { ConfigDynatraceComponent } from "./config-dynatrace/config-dynatrace.component";
import { ConfigSlackComponent }     from "./config-slack/config-slack.component";
import { ConfigUserComponent }      from "./config-user/config-user.component";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    ConfigAlexaComponent,
    ConfigDynatraceComponent,
    ConfigSlackComponent,
    ConfigUserComponent,
  ],
  exports: [
    ConfigAlexaComponent,
    ConfigDynatraceComponent,
    ConfigSlackComponent,
    ConfigUserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})

export class ConfigModule { }
