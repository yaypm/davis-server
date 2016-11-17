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
var Step6Component = (function () {
    function Step6Component(wizardService, router) {
        this.wizardService = wizardService;
        this.router = router;
        this.submitted = false;
        this.buttonText = 'Skip & Finish';
    }
    Step6Component.prototype.validate = function () {
        if (this.wizardService.values.watson.stt.user) {
            this.buttonText = 'Finish';
        }
        else {
            this.buttonText = 'Skip & Finish';
        }
    };
    Step6Component.prototype.doSubmit = function () {
        var _this = this;
        if (this.wizardService.values.watson.stt.user) {
            this.wizardService.connectWatson()
                .then(function (result) {
                window.location.assign('https://' + window.location.host);
            }, function (error) {
                console.log(error);
                _this.wizardService.steps[5].status = 'failure';
            });
            this.submitted = true;
        }
        else {
            window.location.assign('https://' + window.location.host);
        }
    };
    Step6Component.prototype.ngOnInit = function () {
        if (this.wizardService.steps[1].status !== 'success') {
            this.router.navigate(['src/step2']);
        }
        else if (this.wizardService.steps[2].status !== 'success') {
            this.router.navigate(['src/step3']);
        }
    };
    Step6Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-step6',
            templateUrl: './step6.component.html',
            styleUrls: ['./step6.component.css']
        }), 
        __metadata('design:paramtypes', [wizard_service_1.WizardService, router_1.Router])
    ], Step6Component);
    return Step6Component;
}());
exports.Step6Component = Step6Component;
//# sourceMappingURL=step6.component.js.map