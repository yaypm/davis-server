// ============================================================================
// Auth Login - Component
//
// This component creates a login form for authentication
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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var davis_service_1 = require('../../shared/davis.service');
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var AuthLoginComponent = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function AuthLoginComponent(iDavis, router) {
        this.iDavis = iDavis;
        this.router = router;
        // Initialize form submission
        this.submitted = false;
        this.loginError = null;
        this.password = '';
        this.iDavis.titleGlobal = '';
    }
    // ------------------------------------------------------
    // Initialize component
    // ------------------------------------------------------
    AuthLoginComponent.prototype.login = function (form) {
        var _this = this;
        this.submitted = true;
        this.iDavis.values.authenticate.email = form.value.email;
        this.iDavis.values.authenticate.password = form.value.password;
        this.iDavis.getJwtToken()
            .then(function (result) {
            if (result.success) {
                _this.loginError = null;
                _this.iDavis.token = result.token;
                _this.iDavis.isAuthenticated = true;
                _this.iDavis.isAdmin = result.admin;
                localStorage.setItem('email', form.value.email);
                localStorage.setItem('token', result.token);
                localStorage.setItem('isAdmin', result.admin);
                _this.router.navigate(['/configuration']);
            }
            else {
                _this.loginError = result.message;
                _this.password = '';
            }
        });
    };
    AuthLoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'auth-login',
            templateUrl: './auth-login.component.html',
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, router_1.Router])
    ], AuthLoginComponent);
    return AuthLoginComponent;
}());
exports.AuthLoginComponent = AuthLoginComponent;
//# sourceMappingURL=auth-login.component.js.map