// ============================================================================
// Wizard - MODULE
//
// This module handles all functionality for the Wizard section
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { WizardBaseComponent } from "./wizard-base/wizard-base.component";

// Modules
import { ConfigModule } from "../shared/config/config.module";

// Routes
import { WizardRouting } from "./wizard.routing";

// Services
import { ConfigService } from "../shared/config/config.service";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    WizardBaseComponent,
  ],
  imports: [
    CommonModule,
    ConfigModule,
    WizardRouting
  ],
  providers: [
    ConfigService,
  ]
})

export class WizardModule { }
