import { Component } from "@angular/core";
import { ConfigService } from "../config.service";
import { DavisService } from "../../davis.service";
export var ConfigAlexaComponent = (function () {
    function ConfigAlexaComponent(davisService, iConfig) {
        this.davisService = davisService;
        this.iConfig = iConfig;
        this.submitted = false;
        this.buttonText = "Skip";
    }
    ConfigAlexaComponent.prototype.validate = function () {
        if (this.davisService.values.alexa_ids) {
            this.buttonText = "Continue";
        }
        else {
            this.buttonText = "Skip";
        }
    };
    ConfigAlexaComponent.prototype.doSubmit = function () {
        var _this = this;
        if (this.davisService.values.alexa_ids) {
            this.davisService.connectAlexa()
                .then(function (result) {
                _this.davisService.config["alexa"].success = true;
                _this.iConfig.SelectView("slack");
            }, function (error) {
                console.log(error);
                _this.davisService.config["alexa"].success = false;
            });
        }
        else {
            this.iConfig.SelectView("slack");
        }
        this.submitted = true;
    };
    ConfigAlexaComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "config-alexa",
                    templateUrl: "./config-alexa.component.html",
                },] },
    ];
    ConfigAlexaComponent.ctorParameters = [
        { type: DavisService, },
        { type: ConfigService, },
    ];
    return ConfigAlexaComponent;
}());
//# sourceMappingURL=config-alexa.component.js.map