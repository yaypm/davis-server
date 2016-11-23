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
import { ConfigBaseComponent } from "./config-base/config-base.component";

// Services
// import { AuthGuard } from "../auth/auth-guard/auth-guard.service";

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const ConfigRoutes: Routes = [
  {
    path: "config",
    component: ConfigBaseComponent,
    // canActivate: [AuthGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const ConfigRouting = RouterModule.forChild(ConfigRoutes);
