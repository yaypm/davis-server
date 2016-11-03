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
var wizard_service_1 = require('../wizard.service');
var Step5Component = (function () {
    function Step5Component(wizardService, router) {
        this.wizardService = wizardService;
        this.router = router;
        this.myURL = '';
        this.submitted = false;
        this.success = false;
        this.buttonText = 'Create Davis Slack Bot';
        this.myURL = 'https://' + window.location.host;
    }
    Step5Component.prototype.validate = function () {
        if (this.wizardService.values.slack.clientId.length > 20 && this.wizardService.values.slack.clientSecret.length > 20) {
            this.buttonText = 'Create Davis Slack Bot';
        }
        else if (!this.success) {
            this.buttonText = 'Skip';
        }
    };
    Step5Component.prototype.doSubmit = function () {
        var _this = this;
        if (!this.success) {
            this.wizardService.connectSlack()
                .then(function (result) {
                _this.success = true;
            }, function (error) {
                console.log(error);
            });
            this.submitted = true;
            this.buttonText = 'Next';
        }
        else {
            this.router.navigate(['wizard/src/step6']);
        }
    };
    Step5Component.prototype.ngOnInit = function () {
        if (this.wizardService.values.user.name.first.length < 1) {
            this.router.navigate(['wizard/src/step2']);
        }
        else if (this.wizardService.values.dynatrace.url.length < 1) {
            this.router.navigate(['wizard/src/step3']);
        }
    };
    Step5Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'step5',
            templateUrl: './step5.component.html',
            styleUrls: ['./step5.component.css']
        }), 
        __metadata('design:paramtypes', [wizard_service_1.WizardService, router_1.Router])
    ], Step5Component);
    return Step5Component;
}());
exports.Step5Component = Step5Component;
//# sourceMappingURL=step5.component.js.map