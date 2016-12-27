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
import { WizardGuard } from "../auth/auth-guard/wizard-guard.service";

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const WizardRoutes: Routes = [
  {
    path:       "",
    redirectTo: "/wizard",
    pathMatch:  "full"
  },
  {
    path: "wizard",
    component: WizardBaseComponent,
    canActivate: [WizardGuard],
  },
  {
    path: '**', 
    component: WizardBaseComponent,
    canActivate: [WizardGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const WizardRouting = RouterModule.forChild(WizardRoutes);
