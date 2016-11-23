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
var router_1 = require("@angular/router");
var config_service_1 = require("../../config.service");
var ConfigAlexaComponent = (function () {
    function ConfigAlexaComponent(configService, router) {
        this.configService = configService;
        this.router = router;
        this.submitted = false;
        this.buttonText = "Skip";
    }
    ConfigAlexaComponent.prototype.validate = function () {
        if (this.configService.values.alexa_ids) {
            this.buttonText = "Continue";
        }
        else {
            this.buttonText = "Skip";
        }
    };
    ConfigAlexaComponent.prototype.doSubmit = function () {
        var _this = this;
        if (this.configService.values.alexa_ids) {
            this.configService.connectAlexa()
                .then(function (result) {
                _this.configService.config["alexa"].success = true;
                _this.router.navigate([_this.configService.config["slack"].path]);
            }, function (error) {
                console.log(error);
                _this.configService.config["alexa"].success = false;
            });
        }
        else {
            this.router.navigate([this.configService.config["slack"].path]);
        }
        this.submitted = true;
    };
    ConfigAlexaComponent.prototype.ngOnInit = function () {
        if (!this.configService.config["user"].success) {
            this.router.navigate([this.configService.config["user"].path]);
        }
        else if (!this.configService.config["dynatrace"].success) {
            this.router.navigate([this.configService.config["dynatrace"].path]);
        }
    };
    ConfigAlexaComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "config-alexa",
            templateUrl: "./config-alexa.component.html",
        }), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router])
    ], ConfigAlexaComponent);
    return ConfigAlexaComponent;
}());
exports.ConfigAlexaComponent = ConfigAlexaComponent;
//# sourceMappingURL=config-alexa.component.js.map