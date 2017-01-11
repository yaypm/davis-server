// ============================================================================
// Auth - ROUTING
//
// This module handles all routing for the Auth section
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Routes, RouterModule } from '@angular/router';

// Components
import { AuthLoginComponent } from './auth-login/auth-login.component';

// Services
import { ConfigGuard } from '../auth/auth-guard/config-guard.service';

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
const AuthRoutes: Routes = [
  {
    children: [
      {
        component: AuthLoginComponent,
        path: 'login',
      },
    ],
    path: 'auth',
  },
];

// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
export const AuthRouting = RouterModule.forChild(AuthRoutes);
