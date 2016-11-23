import { Component } from "@angular/core";
import { ConfigService } from "../config.service";
import { DavisService } from "../../davis.service";
export var ConfigUserComponent = (function () {
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
    ConfigUserComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "config-user",
                    templateUrl: "./config-user.component.html",
                },] },
    ];
    ConfigUserComponent.ctorParameters = [
        { type: DavisService, },
        { type: ConfigService, },
    ];
    return ConfigUserComponent;
}());
//# sourceMappingURL=config-user.component.js.map