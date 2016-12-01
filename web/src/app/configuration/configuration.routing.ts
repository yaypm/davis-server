// ============================================================================
// Configuration - ROUTING
//
// This module handles all routing for the Configuration section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Routes, RouterModule } from '@angular/router';

// Components
import { ConfigurationBaseComponent } from './configuration-base/configuration-base.component';

// Services
import { ConfigGuard } from '../auth/auth-guard/config-guard.service';

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const ConfigurationRoutes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationBaseComponent,
    canActivate: [ConfigGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const ConfigurationRouting = RouterModule.forChild(ConfigurationRoutes);
