// ============================================================================
// Admin Guard - SERVICE
//
// This service checks to see if the user is an admin before completing route
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
export class AdminGuard implements CanActivate {
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(
    private iConfig: DavisService,
    private router: Router) { }

  // ------------------------------------------------------
  // Check if user is an admin before routing
  // ------------------------------------------------------
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | boolean {
    // Check if user an admin
    if (this.iConfig.isAdmin) {
      return true;
    }

    // Route home if the user is not an admin
    this.router.navigate(["/wizard"]);
    return false;
  }
}
