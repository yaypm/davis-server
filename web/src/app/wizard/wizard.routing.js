import { RouterModule } from "@angular/router";
import { WizardBaseComponent } from "./wizard-base/wizard-base.component";
import { WizardGuard } from "../auth/auth-guard/wizard-guard.service";
var WizardRoutes = [
    {
        path: "",
        redirectTo: "/wizard",
        pathMatch: "full"
    },
    {
        path: "wizard",
        component: WizardBaseComponent,
        canActivate: [WizardGuard],
    },
];
export var WizardRouting = RouterModule.forChild(WizardRoutes);
//# sourceMappingURL=wizard.routing.js.map