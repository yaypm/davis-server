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
var davis_service_1 = require('../../davis.service');
var _ = require("lodash");
var ConfigSlackComponent = (function () {
    function ConfigSlackComponent(iDavis) {
        this.iDavis = iDavis;
        this.myURL = '';
        this.requestUri = '';
        this.submitted = false;
        this.submitButton = (this.iDavis.isWizard) ? 'Skip' : 'Create Davis Slack Bot';
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.isDirty = false;
        this.myURL = 'https://' + window.location.host;
        this.requestUri = this.myURL + "/slack/receive";
        this.iDavis.values.slack.redirectUri = this.myURL + "/oauth";
    }
    ConfigSlackComponent.prototype.validate = function () {
        if (this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
            this.submitButton = 'Create Davis Slack Bot';
        }
        else if (!this.iDavis.config['slack'].success && this.iDavis.isWizard) {
            this.submitButton = 'Skip and Finish';
        }
        this.isDirty = !_.isEqual(this.iDavis.values.slack, this.iDavis.values.original.slack);
    };
    ConfigSlackComponent.prototype.doSubmit = function () {
        var _this = this;
        if (!this.iDavis.config['slack'].success && this.iDavis.values.slack.clientId && this.iDavis.values.slack.clientSecret) {
            this.submitButton = 'Saving...';
            this.iDavis.connectSlack()
                .then(function (result) {
                if (result.success) {
                    _this.iDavis.startSlack()
                        .then(function (result) {
                        if (result.success) {
                            sessionStorage.setItem('wizard-finished', 'true');
                            _this.iDavis.config['slack'].success = true;
                        }
                        else {
                            _this.iDavis.config['slack'].success = false;
                            _this.iDavis.config['slack'].error = result.message;
                        }
                    }, function (error) {
                        console.log(error);
                        _this.iDavis.config['slack'].success = false;
                    });
                }
                else {
                    _this.iDavis.config['slack'].success = false;
                    _this.iDavis.config['slack'].error = result.message;
                }
            }, function (error) {
                console.log(error);
                _this.iDavis.config['slack'].success = false;
            });
            this.submitted = true;
        }
        else {
            sessionStorage.setItem('wizard-finished', 'true');
            this.iDavis.windowLocation(this.myURL);
        }
    };
    ConfigSlackComponent.prototype.ngOnInit = function () {
        setTimeout(function () {
            document.getElementsByName('clientId')[0].focus();
            new Clipboard('.clipboard');
        }, 200);
    };
    ConfigSlackComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-slack',
            templateUrl: './config-slack.component.html',
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService])
    ], ConfigSlackComponent);
    return ConfigSlackComponent;
}());
exports.ConfigSlackComponent = ConfigSlackComponent;
//# sourceMappingURL=config-slack.component.js.map