import { Component } from "@angular/core";
import { ConfigService } from "../config.service";
import { DavisService } from "../../davis.service";
export var ConfigDynatraceComponent = (function () {
    function ConfigDynatraceComponent(davisService, iConfig) {
        this.davisService = davisService;
        this.iConfig = iConfig;
        this.submitted = false;
    }
    ConfigDynatraceComponent.prototype.doSubmit = function () {
        var _this = this;
        this.davisService.connectDynatrace()
            .then(function (result) {
            if (result.success) {
                _this.davisService.validateDynatrace()
                    .then(function (res) {
                    if (res.success) {
                        _this.davisService.config["dynatrace"].success = true;
                        _this.iConfig.SelectView("alexa");
                    }
                    else {
                        _this.davisService.config["dynatrace"].success = false;
                        _this.davisService.config["dynatrace"].error = res.message;
                    }
                }, function (err) {
                    _this.davisService.config["dynatrace"].success = false;
                    _this.davisService.config["dynatrace"].error = "Sorry an error occured, please try again.";
                });
            }
            else {
                _this.davisService.config["dynatrace"].success = false;
                _this.davisService.config["dynatrace"].error = result.message;
            }
        }, function (error) {
            _this.davisService.config["dynatrace"].success = false;
            _this.davisService.config["dynatrace"].error = "Sorry an error occured, please try again.";
        });
        this.submitted = true;
    };
    ConfigDynatraceComponent.prototype.keySubmit = function (keyCode) {
        if (keyCode === 13) {
            this.doSubmit();
        }
    };
    ConfigDynatraceComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "config-dynatrace",
                    templateUrl: "./config-dynatrace.component.html",
                },] },
    ];
    ConfigDynatraceComponent.ctorParameters = [
        { type: DavisService, },
        { type: ConfigService, },
    ];
    return ConfigDynatraceComponent;
}());
//# sourceMappingURL=config-dynatrace.component.js.map