// ============================================================================
// Davis - MODULE
//
// This module handles all functionality for the Davis section
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { DavisBaseComponent } from "./davis-base/davis-base.component";

// Routes
import { DavisRouting } from "./davis.routing";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
   DavisBaseComponent,
  ],
  imports: [
    CommonModule,
    DavisRouting
  ]
})

export class DavisModule { }
