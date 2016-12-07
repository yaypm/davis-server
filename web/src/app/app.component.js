// ============================================================================
// App - COMPONENT
//
// This component is the foundation of the application
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
// Third party
require("./rxjs-operators");
var davis_service_1 = require("./shared/davis.service");
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var AppComponent = (function () {
    function AppComponent(iDavis, router) {
        this.iDavis = iDavis;
        this.router = router;
    }
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "davis",
            templateUrl: "./app.component.html",
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map