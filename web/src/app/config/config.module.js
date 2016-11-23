import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigBaseComponent } from "./config-base/config-base.component";
import { ConfigRouting } from "./config.routing";
export var ConfigModule = (function () {
    function ConfigModule() {
    }
    ConfigModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ConfigBaseComponent,
                    ],
                    imports: [
                        CommonModule,
                        ConfigRouting
                    ],
                },] },
    ];
    ConfigModule.ctorParameters = [];
    return ConfigModule;
}());
//# sourceMappingURL=config.module.js.map