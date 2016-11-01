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
var wizard_service_1 = require('../wizard.service');
var Step1Component = (function () {
    function Step1Component(wizardService) {
        this.wizardService = wizardService;
        this.submitted = false;
    }
    Step1Component.prototype.doLogin = function (loginForm) {
        var _this = this;
        console.log(loginForm.value);
        this.wizardService.getToken(loginForm.value.email, loginForm.value.password)
            .then(function (response) {
            _this.token = response.token;
            console.log('token: ' + _this.token);
        }, function (error) {
            _this.errorMessage = error;
            console.log(_this.errorMessage);
        });
        this.submitted = true;
    };
    Step1Component.prototype.ngOnInit = function () {
    };
    Step1Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'step1',
            templateUrl: './step1.component.html',
            styleUrls: ['./step1.component.css'],
            providers: [wizard_service_1.WizardService]
        }), 
        __metadata('design:paramtypes', [wizard_service_1.WizardService])
    ], Step1Component);
    return Step1Component;
}());
exports.Step1Component = Step1Component;
//# sourceMappingURL=step1.component.js.map