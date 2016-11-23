import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { WizardModule } from "./wizard/wizard.module";
import { AppRouting } from "./app.routing";
import { WizardGuard } from "./auth/auth-guard/wizard-guard.service";
import { DavisService } from "./shared/davis.service";
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    bootstrap: [
                        AppComponent
                    ],
                    declarations: [
                        AppComponent
                    ],
                    imports: [
                        AuthModule,
                        AppRouting,
                        BrowserModule,
                        ConfigurationModule,
                        FormsModule,
                        HttpModule,
                        JsonpModule,
                        RouterModule,
                        WizardModule,
                    ],
                    providers: [
                        WizardGuard,
                        DavisService,
                    ],
                },] },
    ];
    AppModule.ctorParameters = [];
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map