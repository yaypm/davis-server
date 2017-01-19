// ============================================================================
// Davis - MODULE
//
// This module handles all functionality for the Davis section
// ============================================================================

// ----------------------------------------------------------------------------
//  Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }               from "@angular/core";
import { CommonModule }           from "@angular/common";
import { FormsModule }            from '@angular/forms';

// Components
import { DavisBaseComponent } from "./davis-base/davis-base.component";

// Routes
import { DavisRouting } from "./davis.routing";

// Modules
import { SharedDavisModule }      from '../shared/davis/shared-davis.module';

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
   DavisBaseComponent,
  ],
  imports: [
    CommonModule,
    DavisRouting,
    FormsModule,
    SharedDavisModule,
  ]
})

export class DavisModule { }
