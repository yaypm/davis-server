// ============================================================================
// Config Base - Component
//
// This component creates Configuration landing page
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
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var ConfigBaseComponent = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function ConfigBaseComponent(router) {
        this.router = router;
    }
    // ------------------------------------------------------
    // Initialize component
    // ------------------------------------------------------
    ConfigBaseComponent.prototype.ngOnInit = function () {
    };
    ConfigBaseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "config-base",
            templateUrl: "./config-base.component.html",
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], ConfigBaseComponent);
    return ConfigBaseComponent;
}());
exports.ConfigBaseComponent = ConfigBaseComponent;
//# sourceMappingURL=config-base.component.js.map