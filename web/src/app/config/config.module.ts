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

// Components
import { ConfigBaseComponent } from "./config-base/config-base.component";

// Routes
import { ConfigRouting } from "./config.routing";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    ConfigBaseComponent,
  ],
  imports: [
    CommonModule,
    ConfigRouting
  ],
})

export class ConfigModule { }
