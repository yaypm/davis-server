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
var config_alexa_component_1 = require('../config-alexa/config-alexa.component');
var config_dynatrace_component_1 = require('../config-dynatrace/config-dynatrace.component');
var config_slack_component_1 = require('../config-slack/config-slack.component');
var config_user_component_1 = require('../config-user/config-user.component');
var wizardRoutes = [
    {
        path: '',
        redirectTo: '/wizard',
        pathMatch: 'full'
    },
    {
        path: 'wizard',
        component: WizardComponent,
        children: [
            {
                path: 'config-alexa',
                component: config_alexa_component_1.ConfigAlexaComponent
            },
            {
                path: 'config-dynatrace',
                component: config_dynatrace_component_1.ConfigDynatraceComponent
            },
            {
                path: 'config-slack',
                component: config_slack_component_1.ConfigSlackComponent
            },
            {
                path: 'config-user',
                component: config_user_component_1.ConfigUserComponent
            }
        ]
    }
];
var WizardRoutingModule = (function () {
    function WizardRoutingModule() {
    }
    WizardRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild(wizardRoutes)
            ],
            exports: [
                router_1.RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], WizardRoutingModule);
    return WizardRoutingModule;
}());
exports.WizardRoutingModule = WizardRoutingModule;
//# sourceMappingURL=wizard-routing.module.js.map