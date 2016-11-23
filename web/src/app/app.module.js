// ============================================================================
// App - MODULE
//
// This module handles all functionality for the application
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
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
// Components
var app_component_1 = require("./app.component");
// Modules
var auth_module_1 = require("./auth/auth.module");
var configuration_module_1 = require("./configuration/configuration.module");
var wizard_module_1 = require("./wizard/wizard.module");
// Routing
var app_routing_1 = require("./app.routing");
// Services
var wizard_guard_service_1 = require("./auth/auth-guard/wizard-guard.service");
var davis_service_1 = require("./shared/davis.service");
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            imports: [
                auth_module_1.AuthModule,
                app_routing_1.AppRouting,
                platform_browser_1.BrowserModule,
                configuration_module_1.ConfigurationModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                http_1.JsonpModule,
                router_1.RouterModule,
                wizard_module_1.WizardModule,
            ],
            providers: [
                wizard_guard_service_1.WizardGuard,
                davis_service_1.DavisService,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map