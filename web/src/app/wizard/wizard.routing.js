import { RouterModule } from "@angular/router";
import { WizardComponent } from "./wizard-base/wizard.component";
var WizardRoutes = [
    {
        path: "",
        redirectTo: "/wizard",
        pathMatch: "full"
    },
    {
        path: "wizard",
        component: WizardComponent,
    },
];
export var WizardRouting = RouterModule.forChild(WizardRoutes);
//# sourceMappingURL=wizard.routing.js.map