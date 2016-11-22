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
var config_service_1 = require('../config.service');
var ConfigSlackComponent = (function () {
    function ConfigSlackComponent(configService, router) {
        this.configService = configService;
        this.router = router;
        this.myURL = '';
        this.submitted = false;
        this.buttonText = 'Skip';
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.myURL = 'https://' + window.location.host;
    }
    //ToDo: Use https://clipboardjs.com library to add copy to clipboard functionality to URLs
    ConfigSlackComponent.prototype.validate = function () {
        if (this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.buttonText = 'Create Davis Slack Bot';
        }
        else if (!this.configService.config['slack'].success) {
            this.buttonText = 'Skip and Finish';
        }
    };
    ConfigSlackComponent.prototype.doSubmit = function () {
        var _this = this;
        if (!this.configService.config['slack'].success && this.configService.values.slack.clientId && this.configService.values.slack.clientSecret) {
            this.configService.connectSlack()
                .then(function (result) {
                if (result.success) {
                    //REST call to endpoint here, trigger restart of Botkit
                    _this.configService.config['slack'].success = true;
                }
                else {
                    _this.configService.config['slack'].success = false;
                    _this.configService.config['slack'].error = result.message;
                }
            }, function (error) {
                console.log(error);
                _this.configService.config['slack'].success = false;
            });
            this.submitted = true;
        }
        else {
            this.configService.windowLocation(this.myURL);
        }
    };
    ConfigSlackComponent.prototype.ngOnInit = function () {
        if (!this.configService.config['user'].success) {
            this.router.navigate([this.configService.config['user'].path]);
        }
        else if (!this.configService.config['dynatrace'].success) {
            this.router.navigate([this.configService.config['dynatrace'].path]);
        }
    };
    ConfigSlackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-slack',
            templateUrl: './config-slack.component.html',
            styleUrls: ['./config-slack.component.css']
        }), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router])
    ], ConfigSlackComponent);
    return ConfigSlackComponent;
}());
exports.ConfigSlackComponent = ConfigSlackComponent;
//# sourceMappingURL=config-slack.component.js.map