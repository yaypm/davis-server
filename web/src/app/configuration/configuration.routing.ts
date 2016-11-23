// ============================================================================
// Configuration - ROUTING
//
// This module handles all routing for the Configuration section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Routes, RouterModule } from "@angular/router";

// Components
import { ConfigurationBaseComponent } from "./configuration-base/configuration-base.component";

// Services
// import { AuthGuard } from "../auth/auth-guard/auth-guard.service";

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const ConfigurationRoutes: Routes = [
  {
    path: "configuration",
    component: ConfigurationBaseComponent,
    // canActivate: [AuthGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const ConfigurationRouting = RouterModule.forChild(ConfigurationRoutes);
