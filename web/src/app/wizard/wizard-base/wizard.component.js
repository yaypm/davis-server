import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "../../shared/config.service";
export var WizardComponent = (function () {
    function WizardComponent(configService, router) {
        this.configService = configService;
        this.router = router;
    }
    WizardComponent.prototype.ngOnInit = function () {
    };
    WizardComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "wizard",
                    templateUrl: "./wizard.component.html",
                },] },
    ];
    WizardComponent.ctorParameters = [
        { type: ConfigService, },
        { type: Router, },
    ];
    return WizardComponent;
}());
//# sourceMappingURL=wizard.component.js.map