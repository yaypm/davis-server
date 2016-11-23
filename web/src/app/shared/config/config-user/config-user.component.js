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
var config_service_1 = require("../config.service");
var davis_service_1 = require("../../davis.service");
var ConfigUserComponent = (function () {
    function ConfigUserComponent(davisService, iConfig) {
        this.davisService = davisService;
        this.iConfig = iConfig;
        this.submitted = false;
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.isSelectOpened = false;
    }
    ConfigUserComponent.prototype.doSubmit = function () {
        var _this = this;
        this.davisService.addDavisUser()
            .then(function (result) {
            if (result.success) {
                if (_this.davisService.isWizard) {
                    _this.davisService.removeDavisUser(_this.davisService.values.authenticate.email)
                        .then(function (res) {
                        if (res.success) {
                            _this.davisService.config["user"].success = true;
                            // Authenticate new user, update token
                            _this.davisService.values.authenticate.email = _this.davisService.values.user.email;
                            _this.davisService.values.authenticate.password = _this.davisService.values.user.password;
                            _this.davisService.getJwtToken()
                                .then(function (response) {
                                _this.davisService.token = response.token;
                                _this.iConfig.SelectView("dynatrace");
                            }, function (error) {
                                _this.davisService.config["user"].success = false;
                                _this.davisService.config["user"].error = "Sorry an error occured, please try again.";
                            });
                        }
                        else {
                            _this.davisService.config["user"].success = false;
                            _this.davisService.config["user"].error = res.message;
                        }
                    }, function (error) {
                        _this.davisService.config["user"].success = false;
                        _this.davisService.config["user"].error = "Sorry an error occured, please try again.";
                    });
                }
            }
            else {
                _this.davisService.config["user"].success = false;
                _this.davisService.config["user"].error = result.message;
                _this.davisService.values.user.email = "";
                _this.davisService.values.user.password = "";
            }
        }, function (error) {
            _this.davisService.config["user"].success = false;
            _this.davisService.config["user"].error = "Sorry an error occured, please try again.";
        });
        this.submitted = true;
    };
    ConfigUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.davisService.isWizard && !this.davisService.token) {
            this.davisService.values.authenticate.email = "admin@localhost";
            this.davisService.values.authenticate.password = "changeme";
            this.davisService.values.user.admin = true;
        }
        this.davisService.getJwtToken()
            .then(function (response) {
            _this.davisService.token = response.token;
            _this.davisService.getTimezones()
                .then(function (response) {
                _this.davisService.timezones = response.timezones;
                _this.davisService.values.user.timezone = _this.davisService.getTimezone();
            }, function (error) {
                _this.davisService.config["user"].success = false;
                _this.davisService.config["user"].error = "Unable to get timezones, please try again later.";
            });
        }, function (error) {
            _this.davisService.config["user"].success = false;
            _this.davisService.config["user"].error = "Sorry an error occured, please try again.";
        });
    };
    ConfigUserComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "config-user",
            templateUrl: "./config-user.component.html",
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, config_service_1.ConfigService])
    ], ConfigUserComponent);
    return ConfigUserComponent;
}());
exports.ConfigUserComponent = ConfigUserComponent;
//# sourceMappingURL=config-user.component.js.map