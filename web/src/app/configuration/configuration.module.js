// ============================================================================
// Configuration - MODULE
//
// This module handles all functionality for the Configuration section
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
//  Imports
// ----------------------------------------------------------------------------
// Angular
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var config_module_1 = require("../shared/config/config.module");
var config_service_1 = require("../shared/config/config.service");
// Components
var configuration_base_component_1 = require("./configuration-base/configuration-base.component");
// Routes
var configuration_routing_1 = require("./configuration.routing");
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
var ConfigurationModule = (function () {
    function ConfigurationModule() {
    }
    ConfigurationModule = __decorate([
        core_1.NgModule({
            declarations: [
                configuration_base_component_1.ConfigurationBaseComponent,
            ],
            imports: [
                common_1.CommonModule,
                configuration_routing_1.ConfigurationRouting,
                config_module_1.ConfigModule,
            ],
            providers: [
                config_service_1.ConfigService,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ConfigurationModule);
    return ConfigurationModule;
}());
exports.ConfigurationModule = ConfigurationModule;
//# sourceMappingURL=configuration.module.js.map