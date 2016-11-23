// ============================================================================
// Wizard - MODULE
//
// This module handles all functionality for the Wizard section
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
var wizard_component_1 = require("./wizard-base/wizard.component");
// Routes
var wizard_routing_1 = require("./wizard.routing");
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
var WizardModule = (function () {
    function WizardModule() {
    }
    WizardModule = __decorate([
        core_1.NgModule({
            declarations: [
                wizard_component_1.WizardComponent,
            ],
            imports: [
                common_1.CommonModule,
                wizard_routing_1.WizardRouting
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], WizardModule);
    return WizardModule;
}());
exports.WizardModule = WizardModule;
//# sourceMappingURL=wizard.module.js.map