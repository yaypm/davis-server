import { Component } from "@angular/core";
import { Router } from "@angular/router";
export var AuthLoginComponent = (function () {
    function AuthLoginComponent(router) {
        this.router = router;
        this.submitted = false;
    }
    AuthLoginComponent.prototype.ngOnInit = function () {
    };
    AuthLoginComponent.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: "auth-login",
                    templateUrl: "./auth-login.component.html",
                },] },
    ];
    AuthLoginComponent.ctorParameters = [
        { type: Router, },
    ];
    return AuthLoginComponent;
}());
//# sourceMappingURL=auth-login.component.js.map