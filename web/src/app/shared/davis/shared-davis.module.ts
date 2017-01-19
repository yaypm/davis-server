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
import { SlackTagConversionPipe }   from './davis-slack-pipe/davis-slack.pipe';

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    DavisCardComponent,
    SlackTagConversionPipe,
  ],
  exports: [
    DavisCardComponent,
    SlackTagConversionPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
  ],
})

export class SharedDavisModule { }
