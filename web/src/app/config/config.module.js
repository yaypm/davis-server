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
// Components
var config_base_component_1 = require("./config-base/config-base.component");
// Routes
var config_routing_1 = require("./config.routing");
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
var ConfigModule = (function () {
    function ConfigModule() {
    }
    ConfigModule = __decorate([
        core_1.NgModule({
            declarations: [
                config_base_component_1.ConfigBaseComponent,
            ],
            imports: [
                common_1.CommonModule,
                config_routing_1.ConfigRouting
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], ConfigModule);
    return ConfigModule;
}());
exports.ConfigModule = ConfigModule;
//# sourceMappingURL=config.module.js.map