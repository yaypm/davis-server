// ============================================================================
// Davis - ROUTING
//
// This module handles all routing for the Davis section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Routes, RouterModule } from '@angular/router';

// Components
import { DavisBaseComponent } from './davis-base/davis-base.component';

// Services
import { DavisGuard } from '../auth/auth-guard/davis-guard.service';

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const DavisRoutes: Routes = [
  {
    path: 'davis',
    component: DavisBaseComponent,
    canActivate: [DavisGuard],
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const DavisRouting = RouterModule.forChild(DavisRoutes);
