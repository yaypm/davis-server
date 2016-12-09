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
// Services
var config_service_1 = require('../config.service');
var davis_service_1 = require('../../davis.service');
var _ = require("lodash");
var ConfigUserComponent = (function () {
    function ConfigUserComponent(iDavis, iConfig) {
        this.iDavis = iDavis;
        this.iConfig = iConfig;
        this.submitted = false;
        this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
        this.submitButtonDefault = (this.iDavis.isWizard) ? 'Continue' : 'Save';
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.isSelectOpened = false;
        this.isDirty = false;
    }
    ConfigUserComponent.prototype.doSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.submitButton = 'Saving...';
        this.user = (!this.iDavis.isWizard && !this.isMyUser) ? this.iDavis.values.otherUser : this.iDavis.values.user;
        if ((!this.iDavis.isWizard && !this.isNewUser) || (!this.iDavis.isWizard && this.isMyUser)) {
            this.iDavis.updateDavisUser(this.user)
                .then(function (result) {
                if (result.success) {
                    _this.iDavis.values.original.user = _.cloneDeep(_this.user);
                    _this.isDirty = false;
                    _this.iDavis.config['user'].success = true;
                    _this.submitButton = 'Save';
                }
                else {
                    _this.submitButton = 'Save';
                    _this.iDavis.config['user'].success = false;
                    _this.iDavis.config['user'].error = result.message;
                }
            }, function (error) {
                _this.submitButton = 'Save';
                _this.iDavis.config['user'].success = false;
                _this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
            });
        }
        else {
            this.iDavis.addDavisUser(this.user)
                .then(function (result) {
                if (result.success) {
                    _this.submitButton = _this.submitButtonDefault;
                    _this.iDavis.config['user'].success = true;
                    _this.iDavis.config['user'].error = null;
                    _this.iDavis.values.otherUser = {
                        email: null,
                        password: null,
                        timezone: null,
                        alexa_ids: null,
                        name: {
                            first: null,
                            last: null
                        },
                        admin: false
                    };
                    _this.iDavis.values.otherUser.timezone = _this.iDavis.getTimezone();
                    _this.iDavis.values.original.otherUser = _.cloneDeep(_this.iDavis.values.otherUser);
                    if (_this.iDavis.isWizard) {
                        _this.iDavis.values.original.user = _.cloneDeep(_this.user);
                        _this.isDirty = false;
                        _this.iDavis.removeDavisUser(_this.iDavis.values.authenticate.email)
                            .then(function (res) {
                            if (res.success) {
                                _this.iDavis.config['user'].success = true;
                                // Authenticate new user, update token
                                _this.iDavis.values.authenticate.email = _this.iDavis.values.user.email;
                                _this.iDavis.values.authenticate.password = _this.iDavis.values.user.password;
                                _this.iDavis.getJwtToken()
                                    .then(function (response) {
                                    _this.iDavis.token = response.token;
                                    _this.iConfig.SelectView('dynatrace');
                                    _this.submitButton = _this.submitButtonDefault;
                                    sessionStorage.setItem('email', _this.iDavis.values.user.email);
                                    sessionStorage.setItem('token', response.token);
                                    sessionStorage.setItem('isAdmin', response.admin);
                                }, function (error) {
                                    _this.iDavis.config['user'].success = false;
                                    _this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                                    _this.submitButton = _this.submitButtonDefault;
                                });
                            }
                            else {
                                _this.iDavis.config['user'].success = false;
                                _this.iDavis.config['user'].error = res.message;
                                _this.submitButton = _this.submitButtonDefault;
                            }
                        }, function (error) {
                            _this.iDavis.config['user'].success = false;
                            _this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                            _this.submitButton = _this.submitButtonDefault;
                        });
                    }
                    else {
                        _this.iDavis.values.original.otherUser = _.cloneDeep(_this.user);
                    }
                }
                else {
                    _this.iDavis.config['user'].success = false;
                    _this.iDavis.config['user'].error = result.message;
                    _this.iDavis.values.user.email = '';
                    _this.iDavis.values.user.password = '';
                    _this.submitButton = _this.submitButtonDefault;
                }
            }, function (error) {
                _this.iDavis.config['user'].success = false;
                _this.iDavis.config['user'].error = 'Sorry an error occurred, please try again.';
                _this.submitButton = _this.submitButtonDefault;
            });
        }
    };
    ConfigUserComponent.prototype.validate = function () {
        this.isDirty = (this.isMyUser) ? !_.isEqual(this.iDavis.values.user, this.iDavis.values.original.user) : !_.isEqual(this.iDavis.values.otherUser, this.iDavis.values.original.otherUser);
    };
    ConfigUserComponent.prototype.onTimezoneChange = function (tz) {
        if (this.isMyUser) {
            this.iDavis.values.user.timezone = tz;
        }
        else {
            this.iDavis.values.otherUser.timezone = tz;
        }
    };
    ConfigUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isNewUser) {
            this.submitButtonDefault = 'Add User';
        }
        this.iDavis.getTimezones()
            .then(function (response) {
            _this.iDavis.timezones = response.timezones;
            if (_this.iDavis.isWizard) {
                _this.iDavis.values.user.timezone = _this.iDavis.getTimezone();
            }
            else if (_this.isNewUser) {
                _this.iDavis.values.otherUser.timezone = _this.iDavis.getTimezone();
            }
        }, function (error) {
            _this.iDavis.config['user'].success = false;
            _this.iDavis.config['user'].error = 'Unable to get timezones, please try again later.';
        })
            .catch(function (err) {
            if (err.includes('invalid token')) {
                _this.iDavis.logOut();
            }
        });
        setTimeout(function () {
            if (document.getElementsByName('first')[0]) {
                document.getElementsByName('first')[0].focus();
            }
            _this.validate();
        }, 200);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ConfigUserComponent.prototype, "isMyUser", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ConfigUserComponent.prototype, "isNewUser", void 0);
    ConfigUserComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-user',
            templateUrl: './config-user.component.html',
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, config_service_1.ConfigService])
    ], ConfigUserComponent);
    return ConfigUserComponent;
}());
exports.ConfigUserComponent = ConfigUserComponent;
//# sourceMappingURL=config-user.component.js.map