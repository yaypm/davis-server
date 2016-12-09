// ============================================================================
// Config Base - Component
//
// This component creates Configuration landing page
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
// Imports
// ----------------------------------------------------------------------------
// Angular
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var config_service_1 = require('../../shared/config/config.service');
var davis_service_1 = require('../../shared/davis.service');
var _ = require("lodash");
// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
var ConfigurationBaseComponent = (function () {
    // ------------------------------------------------------
    // Inject services
    // ------------------------------------------------------
    function ConfigurationBaseComponent(router, iConfig, iDavis) {
        this.router = router;
        this.iConfig = iConfig;
        this.iDavis = iDavis;
        this.showConfigureButton = false;
    }
    // ------------------------------------------------------
    // Initialize component
    // ------------------------------------------------------
    ConfigurationBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (sessionStorage.getItem('wizard-finished')) {
            sessionStorage.removeItem('wizard-finished');
            this.iDavis.titleGlobal = 'Great! It looks like we\'re all set now.';
            this.showConfigureButton = true;
        }
        else {
            this.iDavis.titleGlobal = 'Configure Davis';
        }
        this.iDavis.config['user'].success = null;
        this.iDavis.config['user'].error = null;
        this.iDavis.config['dynatrace'].success = null;
        this.iDavis.config['dynatrace'].error = null;
        this.iDavis.config['slack'].success = null;
        this.iDavis.config['slack'].error = null;
        this.iDavis.helpLinkText = 'Help for these settings';
        this.iDavis.getDavisUser()
            .then(function (result) {
            if (result.success) {
                _this.iDavis.values.user = result.user;
                if (!result.user.name) {
                    _this.iDavis.values.user.name = { first: '', last: '' };
                }
                else {
                    if (!result.user.name.first)
                        _this.iDavis.values.user.name.first = '';
                    if (!result.user.name.last)
                        _this.iDavis.values.user.name.last = '';
                }
                _this.iDavis.values.original.user = _.cloneDeep(_this.iDavis.values.user);
            }
            else {
                _this.iDavis.config['user'].error = result.message;
            }
        })
            .catch(function (err) {
            _this.iDavis.config['user'].error = err.message;
            if (err.includes('invalid token')) {
                _this.iDavis.logOut();
            }
        });
        this.iDavis.getDynatrace()
            .then(function (result) {
            if (result.success) {
                _this.iDavis.values.dynatrace = result.dynatrace;
                _this.iDavis.values.original.dynatrace = _.cloneDeep(_this.iDavis.values.dynatrace);
            }
            else {
                _this.iDavis.config['dynatrace'].error = result.message;
            }
        })
            .catch(function (err) {
            _this.iDavis.config['dynatrace'].error = err.message;
            if (err.includes('invalid token')) {
                _this.iDavis.logOut();
            }
        });
        this.iDavis.getSlack()
            .then(function (result) {
            if (result.success) {
                _this.iDavis.values.slack = result.slack;
                _this.iDavis.values.slack.enabled = true;
                _this.iDavis.values.original.slack = _.cloneDeep(_this.iDavis.values.slack);
            }
            else {
                _this.iDavis.config['slack'].error = result.message;
            }
        })
            .catch(function (err) {
            _this.iDavis.config['slack'].error = err.message;
            if (err.includes('invalid token')) {
                _this.iDavis.logOut();
            }
        });
    };
    ConfigurationBaseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'configuration-base',
            templateUrl: './configuration-base.component.html',
        }), 
        __metadata('design:paramtypes', [router_1.Router, config_service_1.ConfigService, davis_service_1.DavisService])
    ], ConfigurationBaseComponent);
    return ConfigurationBaseComponent;
}());
exports.ConfigurationBaseComponent = ConfigurationBaseComponent;
//# sourceMappingURL=configuration-base.component.js.map