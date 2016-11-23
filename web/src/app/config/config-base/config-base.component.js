import { Component } from "@angular/core";
import { Router } from "@angular/router";
export var ConfigBaseComponent = (function () {
    function ConfigBaseComponent(router) {
        this.router = router;
    }
    ConfigBaseComponent.prototype.ngOnInit = function () {
    };
    ConfigBaseComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "config-base",
                    templateUrl: "./config-base.component.html",
                },] },
    ];
    ConfigBaseComponent.ctorParameters = [
        { type: Router, },
    ];
    return ConfigBaseComponent;
}());
//# sourceMappingURL=config-base.component.js.map