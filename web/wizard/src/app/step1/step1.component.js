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
var Step1Component = (function () {
    function Step1Component(wizardService, router) {
        this.wizardService = wizardService;
        this.router = router;
        this.success = true;
    }
    Step1Component.prototype.getJwtToken = function () {
        var _this = this;
        this.wizardService.getJwtToken()
            .then(function (response) {
            _this.wizardService.token = response.token;
            setTimeout(function () {
                _this.router.navigate(['wizard/src/step2']);
            }, 1000);
        }, function (error) {
            console.log(error);
            _this.wizardService.steps[0].status = 'failure';
        });
    };
    Step1Component.prototype.ngOnInit = function () {
        if (this.wizardService.token) {
            this.router.navigate(['wizard/src/step2']);
        }
        else {
            this.wizardService.steps[0].status = 'success';
            this.getJwtToken();
        }
    };
    Step1Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'step1',
            templateUrl: './step1.component.html',
            styleUrls: ['./step1.component.css'],
        }), 
        __metadata('design:paramtypes', [wizard_service_1.WizardService, router_1.Router])
    ], Step1Component);
    return Step1Component;
}());
exports.Step1Component = Step1Component;
//# sourceMappingURL=step1.component.js.map