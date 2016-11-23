import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WizardBaseComponent } from "./wizard-base/wizard-base.component";
import { ConfigModule } from "../shared/config/config.module";
import { WizardRouting } from "./wizard.routing";
export var WizardModule = (function () {
    function WizardModule() {
    }
    WizardModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        WizardBaseComponent,
                    ],
                    imports: [
                        CommonModule,
                        ConfigModule,
                        WizardRouting
                    ],
                },] },
    ];
    WizardModule.ctorParameters = [];
    return WizardModule;
}());
//# sourceMappingURL=wizard.module.js.map