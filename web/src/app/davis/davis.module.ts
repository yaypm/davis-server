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
<<<<<<< HEAD
    SharedDavisModule,
=======
>>>>>>> 58383a12a776e0a623415edca0df2949f9581a9f
  ]
})

export class DavisModule { }
