// ============================================================================
// Auth Guard - SERVICE
//
// This service checks to see if the user is logged in before completing route
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Injectable } from "@angular/core";
import { Router, CanActivate,
         ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

// Services
import { DavisService } from "../../shared/davis.service";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Injectable()
export class AuthGuard implements CanActivate {
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(
    private iConfig: DavisService,
    private router: Router) { }

  // ------------------------------------------------------
  // Check if user is logged in before routing
  // ------------------------------------------------------
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    // Check if user is authenticated
    if (this.iConfig.isAuthenticated) {
      return true;
    }

    // Route to the login page if the user is not logged in
    this.router.navigate(["/auth/login"]);
    return false;
  }
}
