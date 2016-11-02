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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var step1_component_1 = require('./step1/step1.component');
var step2_component_1 = require('./step2/step2.component');
var step3_component_1 = require('./step3/step3.component');
var step4_component_1 = require('./step4/step4.component');
var step5_component_1 = require('./step5/step5.component');
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot([
                    { path: 'wizard/src/step1', component: step1_component_1.Step1Component },
                    { path: 'wizard/src/step2', component: step2_component_1.Step2Component },
                    { path: 'wizard/src/step3', component: step3_component_1.Step3Component },
                    { path: 'wizard/src/step4', component: step4_component_1.Step4Component },
                    { path: 'wizard/src/step5', component: step5_component_1.Step5Component },
                    // { path: 'wizard/src/step6', component: Step6Component },
                    { path: 'wizard/src', component: step1_component_1.Step1Component }
                ])
            ],
            exports: [
                router_1.RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map