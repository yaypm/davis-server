// ============================================================================
// Configuration - MODULE
//
// This module handles all functionality for the Configuration section
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigModule } from "../shared/config/config.module";

// Components
import { ConfigurationBaseComponent } from "./configuration-base/configuration-base.component";

// Routes
import { ConfigurationRouting } from "./configuration.routing";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    ConfigurationBaseComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRouting,
    ConfigurationModule,
  ],
})

export class ConfigurationModule { }
