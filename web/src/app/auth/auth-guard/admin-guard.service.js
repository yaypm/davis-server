// ============================================================================
// Admin Guard - SERVICE
//
// This service checks to see if the user is an admin before completing route
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
var config_service_1 = require("../../shared/config.service");
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var AdminGuard = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function AdminGuard(iConfig, router) {
        this.iConfig = iConfig;
        this.router = router;
    }
    // ------------------------------------------------------
    // Check if user is an admin before routing
    // ------------------------------------------------------
    AdminGuard.prototype.canActivate = function (route, state) {
        // Check if user an admin
        if (this.iConfig.isAdmin) {
            return true;
        }
        // Route home if the user is not an admin
        this.router.navigate(["/wizard"]);
        return false;
    };
    AdminGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router])
    ], AdminGuard);
    return AdminGuard;
}());
exports.AdminGuard = AdminGuard;
//# sourceMappingURL=admin-guard.service.js.map