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
var ConfigDynatraceComponent = (function () {
    function ConfigDynatraceComponent(iDavis, iConfig) {
        this.iDavis = iDavis;
        this.iConfig = iConfig;
        this.submitted = false;
        this.submitButton = (this.iDavis.isWizard) ? 'Continue' : 'Save';
        this.isDirty = false;
    }
    ConfigDynatraceComponent.prototype.doSubmit = function () {
        var _this = this;
        this.submitButton = 'Saving...';
        this.iDavis.connectDynatrace()
            .then(function (result) {
            if (result.success) {
                _this.iDavis.validateDynatrace()
                    .then(function (res) {
                    if (res.success) {
                        _this.iDavis.config['dynatrace'].success = true;
                        _this.iConfig.SelectView('alexa');
                    }
                    else {
                        _this.iDavis.config['dynatrace'].success = false;
                        _this.iDavis.config['dynatrace'].error = res.message;
                        _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
                    }
                }, function (err) {
                    _this.iDavis.config['dynatrace'].success = false;
                    _this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
                    _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
                })
                    .catch(function (err) {
                    _this.iDavis.config['dynatrace'].success = false;
                    _this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
                    _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
                });
            }
            else {
                _this.iDavis.config['dynatrace'].success = false;
                _this.iDavis.config['dynatrace'].error = result.message;
                _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
            }
        }, function (error) {
            _this.iDavis.config['dynatrace'].success = false;
            _this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
            _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
        })
            .catch(function (err) {
            _this.iDavis.config['dynatrace'].success = false;
            _this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
            _this.submitButton = (_this.iDavis.isWizard) ? 'Continue' : 'Save';
        });
        this.submitted = true;
    };
    ConfigDynatraceComponent.prototype.validate = function () {
        this.isDirty = !_.isEqual(this.iDavis.values.dynatrace, this.iDavis.values.original.dynatrace);
    };
    ConfigDynatraceComponent.prototype.keySubmit = function (keyCode) {
        if (keyCode === 13) {
            this.doSubmit();
        }
    };
    ConfigDynatraceComponent.prototype.ngOnInit = function () {
        document.getElementsByName('url')[0].focus();
    };
    ConfigDynatraceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-dynatrace',
            templateUrl: './config-dynatrace.component.html',
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, config_service_1.ConfigService])
    ], ConfigDynatraceComponent);
    return ConfigDynatraceComponent;
}());
exports.ConfigDynatraceComponent = ConfigDynatraceComponent;
//# sourceMappingURL=config-dynatrace.component.js.map