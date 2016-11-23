// ============================================================================
// Wizard - ROUTING
//
// This module handles all routing for the Wizard section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Routes, RouterModule } from "@angular/router";

// Components
import { WizardBaseComponent } from "./wizard-base/wizard-base.component";

// Services
// import { AuthGuard } from "../auth/auth-guard/auth-guard.service";

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const WizardRoutes: Routes = [
  {
    path: "",
    redirectTo: "/wizard",
    pathMatch: "full"
  },
  {
    path: "wizard",
    component: WizardBaseComponent,
    // canActivate: [AuthGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const WizardRouting = RouterModule.forChild(WizardRoutes);
