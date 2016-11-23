import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WizardComponent } from "./wizard-base/wizard.component";
import { WizardRouting } from "./wizard.routing";
export var WizardModule = (function () {
    function WizardModule() {
    }
    WizardModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        WizardComponent,
                    ],
                    imports: [
                        CommonModule,
                        WizardRouting
                    ],
                },] },
    ];
    WizardModule.ctorParameters = [];
    return WizardModule;
}());
//# sourceMappingURL=wizard.module.js.map