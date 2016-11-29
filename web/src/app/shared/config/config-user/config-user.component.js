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
    function ConfigUserComponent(iDavis, iConfig) {
        this.iDavis = iDavis;
        this.iConfig = iConfig;
        this.submitted = false;
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.isSelectOpened = false;
    }
    ConfigUserComponent.prototype.doSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.iDavis.addDavisUser()
            .then(function (result) {
            if (result.success) {
                if (_this.iDavis.isWizard) {
                    _this.iDavis.removeDavisUser(_this.iDavis.values.authenticate.email)
                        .then(function (res) {
                        if (res.success) {
                            _this.iDavis.config["user"].success = true;
                            // Authenticate new user, update token
                            _this.iDavis.values.authenticate.email = _this.iDavis.values.user.email;
                            _this.iDavis.values.authenticate.password = _this.iDavis.values.user.password;
                            _this.iDavis.getJwtToken()
                                .then(function (response) {
                                _this.iDavis.token = response.token;
                                _this.iConfig.SelectView("dynatrace");
                            }, function (error) {
                                _this.iDavis.config["user"].success = false;
                                _this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
                            });
                        }
                        else {
                            _this.iDavis.config["user"].success = false;
                            _this.iDavis.config["user"].error = res.message;
                        }
                    }, function (error) {
                        _this.iDavis.config["user"].success = false;
                        _this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
                    });
                }
            }
            else {
                _this.iDavis.config["user"].success = false;
                _this.iDavis.config["user"].error = result.message;
                _this.iDavis.values.user.email = "";
                _this.iDavis.values.user.password = "";
            }
        }, function (error) {
            _this.iDavis.config["user"].success = false;
            _this.iDavis.config["user"].error = "Sorry an error occurred, please try again.";
        });
    };
    ConfigUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.iDavis.getTimezones()
            .then(function (response) {
            _this.iDavis.timezones = response.timezones;
            _this.iDavis.values.user.timezone = _this.iDavis.getTimezone();
        }, function (error) {
            _this.iDavis.config["user"].success = false;
            _this.iDavis.config["user"].error = "Unable to get timezones, please try again later.";
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ConfigUserComponent.prototype, "isWizard", void 0);
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