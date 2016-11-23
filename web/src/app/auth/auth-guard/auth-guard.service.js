// ============================================================================
// Auth Guard - SERVICE
//
// This service checks to see if the user is logged in before completing route
// ============================================================================
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// Services
var davis_service_1 = require("../../shared/davis.service");
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var AuthGuard = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function AuthGuard(iConfig, router) {
        this.iConfig = iConfig;
        this.router = router;
    }
    // ------------------------------------------------------
    // Check if user is logged in before routing
    // ------------------------------------------------------
    AuthGuard.prototype.canActivate = function (route, state) {
        // Check if user is authenticated
        if (this.iConfig.isAuthenticated) {
            return true;
        }
        // Route to the login page if the user is not logged in
        this.router.navigate(["/auth/login"]);
        return false;
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, router_1.Router])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map