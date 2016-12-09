// ============================================================================
// Config Guard - SERVICE
//
// This service checks to see if the default user exists before completing route
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
var ConfigGuard = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function ConfigGuard(iDavis, router) {
        this.iDavis = iDavis;
        this.router = router;
    }
    // ------------------------------------------------------
    // Check if default user is created before routing
    // ------------------------------------------------------
    ConfigGuard.prototype.canActivate = function (route, state) {
        if (!this.iDavis.isWizard && !this.iDavis.token) {
            return this.CheckUser();
        }
        else {
            return true;
        }
    };
    // ------------------------------------------------------
    // Check if defult user exists
    // ------------------------------------------------------
    ConfigGuard.prototype.CheckUser = function () {
        var _this = this;
        // Set default user attributes
        this.iDavis.values.authenticate.email = "admin@localhost";
        this.iDavis.values.authenticate.password = "changeme";
        // Attempt to get token
        return this.iDavis.getJwtToken()
            .then(function (response) { return _this.CheckUserResponse(response); }, function (error) { return _this.CheckUserError(error); });
    };
    // ------------------------------------------------------
    // Handle check user response
    // ------------------------------------------------------
    ConfigGuard.prototype.CheckUserResponse = function (response) {
        if (response.success) {
            this.iDavis.isWizard = true;
            this.iDavis.token = response.token;
            this.iDavis.values.user.admin = true;
            this.router.navigate(["/wizard"]);
            return false;
        }
        else if (sessionStorage.getItem('token')
            && sessionStorage.getItem('isAdmin')
            && sessionStorage.getItem('email')) {
            this.iDavis.isWizard = false;
            this.iDavis.token = sessionStorage.getItem('token');
            this.iDavis.isAuthenticated = true;
            this.iDavis.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
            this.iDavis.values.authenticate.email = sessionStorage.getItem('email');
            return true;
        }
        else {
            this.iDavis.isWizard = false;
            this.router.navigate(["/auth/login"]);
            return false;
        }
    };
    // ------------------------------------------------------
    // Handle check user error
    // ------------------------------------------------------
    ConfigGuard.prototype.CheckUserError = function (error) {
        this.iDavis.isWizard = false;
        this.router.navigate(["/auth/login"]);
        return false;
    };
    ConfigGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, router_1.Router])
    ], ConfigGuard);
    return ConfigGuard;
}());
exports.ConfigGuard = ConfigGuard;
//# sourceMappingURL=config-guard.service.js.map