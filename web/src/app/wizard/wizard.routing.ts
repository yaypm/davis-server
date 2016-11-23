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
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const WizardRouting = RouterModule.forChild(WizardRoutes);
