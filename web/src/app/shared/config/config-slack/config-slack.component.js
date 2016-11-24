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
var core_1 = require("@angular/core");
// Services
var davis_service_1 = require("../../davis.service");
var ConfigSlackComponent = (function () {
    function ConfigSlackComponent(davisService) {
        this.davisService = davisService;
        this.myURL = "";
        this.submitted = false;
        this.buttonText = "Skip";
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.myURL = "https://" + window.location.host;
    }
    //ToDo: Use https://clipboardjs.com library to add copy to clipboard functionality to URLs
    ConfigSlackComponent.prototype.validate = function () {
        if (this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            this.buttonText = "Create Davis Slack Bot";
        }
        else if (!this.davisService.config["slack"].success) {
            this.buttonText = "Skip and Finish";
        }
    };
    ConfigSlackComponent.prototype.doSubmit = function () {
        var _this = this;
        if (!this.davisService.config["slack"].success && this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            //ToDo: Add redirect url and enabled=true to payload
            this.davisService.connectSlack()
                .then(function (result) {
                if (result.success) {
                    //REST call to endpoint here, trigger restart of Botkit
                    _this.davisService.config["slack"].success = true;
                }
                else {
                    _this.davisService.config["slack"].success = false;
                    _this.davisService.config["slack"].error = result.message;
                }
            }, function (error) {
                console.log(error);
                _this.davisService.config["slack"].success = false;
            });
            this.submitted = true;
        }
        else {
            this.davisService.windowLocation(this.myURL);
        }
    };
    ConfigSlackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "config-slack",
            templateUrl: "./config-slack.component.html",
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService])
    ], ConfigSlackComponent);
    return ConfigSlackComponent;
}());
exports.ConfigSlackComponent = ConfigSlackComponent;
//# sourceMappingURL=config-slack.component.js.map