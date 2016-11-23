import { RouterModule } from "@angular/router";
import { AuthLoginComponent } from "./auth-login/auth-login.component";
var AuthRoutes = [
    {
        children: [
            {
                component: AuthLoginComponent,
                path: "login",
            },
        ],
        path: "auth",
    },
];
export var AuthRouting = RouterModule.forChild(AuthRoutes);
//# sourceMappingURL=auth.routing.js.map