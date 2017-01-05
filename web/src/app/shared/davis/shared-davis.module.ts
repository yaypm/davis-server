// ============================================================================
// Shared davis - MODULE
//
// This module handles all functionality for the davis components
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { FormsModule }              from "@angular/forms";

// Components
import { DavisCardComponent }       from "./davis-card/davis-card.component";

// Services

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    DavisCardComponent,
  ],
  exports: [
    DavisCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
  ],
})

export class SharedDavisModule { }
