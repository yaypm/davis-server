// ============================================================================
// Configuration - MODULE
//
// This module handles all functionality for the Configuration components
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
var forms_1 = require("@angular/forms");
// Components
var config_alexa_component_1 = require("./config-alexa/config-alexa.component");
var config_dynatrace_component_1 = require("./config-dynatrace/config-dynatrace.component");
var config_slack_component_1 = require("./config-slack/config-slack.component");
var config_user_component_1 = require("./config-user/config-user.component");
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
var ConfigModule = (function () {
    function ConfigModule() {
    }
    ConfigModule = __decorate([
        core_1.NgModule({
            declarations: [
                config_alexa_component_1.ConfigAlexaComponent,
                config_dynatrace_component_1.ConfigDynatraceComponent,
                config_slack_component_1.ConfigSlackComponent,
                config_user_component_1.ConfigUserComponent,
            ],
            exports: [
                config_alexa_component_1.ConfigAlexaComponent,
                config_dynatrace_component_1.ConfigDynatraceComponent,
                config_slack_component_1.ConfigSlackComponent,
                config_user_component_1.ConfigUserComponent,
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], ConfigModule);
    return ConfigModule;
}());
exports.ConfigModule = ConfigModule;
//# sourceMappingURL=config.module.js.map