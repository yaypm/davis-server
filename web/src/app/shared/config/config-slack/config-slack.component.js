import { Component } from "@angular/core";
import { DavisService } from "../../davis.service";
export var ConfigSlackComponent = (function () {
    function ConfigSlackComponent(davisService) {
        this.davisService = davisService;
        this.myURL = "";
        this.submitted = false;
        this.buttonText = "Skip";
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.myURL = "https://" + window.location.host;
    }
    ConfigSlackComponent.prototype.validate = function () {
        if (this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            this.buttonText = "Create Davis Slack Bot";
        }
        else if (!this.davisService.config["slack"].success) {
            this.buttonText = "Skip and Finish";
        }
    };
    ConfigSlackComponent.prototype.doSubmit = function () {
        var _this = this;
        if (!this.davisService.config["slack"].success && this.davisService.values.slack.clientId && this.davisService.values.slack.clientSecret) {
            this.davisService.connectSlack()
                .then(function (result) {
                if (result.success) {
                    _this.davisService.config["slack"].success = true;
                }
                else {
                    _this.davisService.config["slack"].success = false;
                    _this.davisService.config["slack"].error = result.message;
                }
            }, function (error) {
                console.log(error);
                _this.davisService.config["slack"].success = false;
            });
            this.submitted = true;
        }
        else {
            this.davisService.windowLocation(this.myURL);
        }
    };
    ConfigSlackComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "config-slack",
                    templateUrl: "./config-slack.component.html",
                },] },
    ];
    ConfigSlackComponent.ctorParameters = [
        { type: DavisService, },
    ];
    return ConfigSlackComponent;
}());
//# sourceMappingURL=config-slack.component.js.map