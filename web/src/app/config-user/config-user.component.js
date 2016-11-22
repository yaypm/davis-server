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
var ConfigUserComponent = (function () {
    function ConfigUserComponent(configService, router) {
        this.configService = configService;
        this.router = router;
        this.submitted = false;
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.isSelectOpened = false;
    }
    ConfigUserComponent.prototype.doSubmit = function () {
        var _this = this;
        this.configService.addDavisUser()
            .then(function (result) {
            if (result.success) {
                _this.configService.removeDavisUser('admin@localhost')
                    .then(function (res) {
                    if (res.email === 'admin@localhost') {
                        _this.configService.steps[0].success = true;
                        // Authenticate new user, update token
                        _this.configService.values.authenticate.email = _this.configService.values.user.email;
                        _this.configService.values.authenticate.password = _this.configService.values.user.password;
                        _this.configService.getJwtToken()
                            .then(function (response) {
                            _this.configService.token = response.token;
                            _this.router.navigate([_this.configService.steps[1].path]);
                        }, function (error) {
                            _this.configService.steps[0].success = false;
                            _this.configService.steps[0].error = 'Sorry an error occured, please try again.';
                        });
                    }
                    else {
                        _this.configService.steps[0].success = false;
                        _this.configService.steps[0].error = res.message;
                    }
                }, function (error) {
                    _this.configService.steps[0].success = false;
                    _this.configService.steps[0].error = 'Sorry an error occured, please try again.';
                });
            }
            else {
                _this.configService.steps[0].success = false;
                _this.configService.steps[0].error = result.message;
                _this.configService.values.user.email = '';
                _this.configService.values.user.password = '';
            }
        }, function (error) {
            _this.configService.steps[0].success = false;
            _this.configService.steps[0].error = 'Sorry an error occured, please try again.';
        });
        this.submitted = true;
    };
    ConfigUserComponent.prototype.keySubmit = function (keyCode) {
        if (keyCode == 13)
            this.doSubmit();
    };
    ConfigUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.configService.isWizard && !this.configService.token) {
            this.configService.values.authenticate.email = 'admin@localhost';
            this.configService.values.authenticate.password = 'changeme';
            this.configService.values.user.admin = true;
        }
        this.configService.getJwtToken()
            .then(function (response) {
            _this.configService.token = response.token;
            _this.configService.getTimezones()
                .then(function (response) {
                _this.configService.timezones = response.timezones;
                _this.configService.values.user.timezone = _this.configService.getTimezone();
            }, function (error) {
                _this.configService.steps[0].success = false;
                _this.configService.steps[0].error = 'Unable to get timezones, please try again later.';
            });
        }, function (error) {
            _this.configService.steps[0].success = false;
            _this.configService.steps[0].error = 'Sorry an error occured, please try again.';
        });
    };
    ConfigUserComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-user',
            templateUrl: './config-user.component.html',
            styleUrls: ['./config-user.component.css']
        }), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router])
    ], ConfigUserComponent);
    return ConfigUserComponent;
}());
exports.ConfigUserComponent = ConfigUserComponent;
//# sourceMappingURL=config-user.component.js.map