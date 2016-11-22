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
var ConfigDynatraceComponent = (function () {
    function ConfigDynatraceComponent(configService, router) {
        this.configService = configService;
        this.router = router;
        this.submitted = false;
    }
    ConfigDynatraceComponent.prototype.doSubmit = function () {
        var _this = this;
        this.configService.connectDynatrace()
            .then(function (result) {
            if (result.success) {
                _this.configService.validateDynatrace()
                    .then(function (res) {
                    if (res.success) {
                        _this.configService.steps[1].success = true;
                        _this.router.navigate([_this.configService.steps[2].path]);
                    }
                    else {
                        _this.configService.steps[1].success = false;
                        _this.configService.steps[1].error = res.message;
                    }
                }, function (err) {
                    _this.configService.steps[1].success = false;
                    _this.configService.steps[1].error = 'Sorry an error occured, please try again.';
                });
            }
            else {
                _this.configService.steps[1].success = false;
                _this.configService.steps[1].error = result.message;
            }
        }, function (error) {
            _this.configService.steps[1].success = false;
            _this.configService.steps[1].error = 'Sorry an error occured, please try again.';
        });
        this.submitted = true;
    };
    ConfigDynatraceComponent.prototype.keySubmit = function (keyCode) {
        if (keyCode == 13)
            this.doSubmit();
    };
    ConfigDynatraceComponent.prototype.ngOnInit = function () {
        if (!this.configService.steps[1].success) {
            this.router.navigate([this.configService.steps[1].path]);
        }
    };
    ConfigDynatraceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-dynatrace',
            templateUrl: './config-dynatrace.component.html',
            styleUrls: ['./config-dynatrace.component.css']
        }), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router])
    ], ConfigDynatraceComponent);
    return ConfigDynatraceComponent;
}());
exports.ConfigDynatraceComponent = ConfigDynatraceComponent;
//# sourceMappingURL=config-dynatrace.component.js.map