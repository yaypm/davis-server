import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { WizardModule } from "./wizard/wizard.module";
import { AppRouting } from "./app.routing";
import { ConfigService } from "./shared/config.service";
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
                        ConfigModule,
                        FormsModule,
                        HttpModule,
                        JsonpModule,
                        RouterModule,
                        WizardModule,
                    ],
                    providers: [
                        ConfigService,
                    ],
                },] },
    ];
    AppModule.ctorParameters = [];
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map