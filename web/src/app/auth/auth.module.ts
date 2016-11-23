// ============================================================================
// Auth - MODULE
//
// This module handles all functionality for the Auth section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule }  from "@angular/forms";

// Components
import { AuthLoginComponent } from "./auth-login/auth-login.component";

// Routes
import { AuthRouting } from "./auth.routing";

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
@NgModule({
  declarations: [
    AuthLoginComponent,
  ],
  imports: [
    AuthRouting,
    CommonModule,
    FormsModule,
  ],
})

export class AuthModule { }
