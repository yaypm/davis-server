import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthRouting } from "./auth.routing";
import { AuthLoginComponent } from "./auth-login/auth-login.component";
export var AuthModule = (function () {
    function AuthModule() {
    }
    AuthModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AuthLoginComponent,
                    ],
                    imports: [
                        AuthRouting,
                        CommonModule,
                        FormsModule,
                    ],
                },] },
    ];
    AuthModule.ctorParameters = [];
    return AuthModule;
}());
//# sourceMappingURL=auth.module.js.map