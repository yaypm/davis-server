import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ConfigAlexaComponent } from "./config-alexa/config-alexa.component";
import { ConfigDynatraceComponent } from "./config-dynatrace/config-dynatrace.component";
import { ConfigSlackComponent } from "./config-slack/config-slack.component";
import { ConfigUserComponent } from "./config-user/config-user.component";
import { ConfigUsersComponent } from "./config-users/config-users.component";
import { ConfigService } from "./config.service";
export var ConfigModule = (function () {
    function ConfigModule() {
    }
    ConfigModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ConfigAlexaComponent,
                        ConfigDynatraceComponent,
                        ConfigSlackComponent,
                        ConfigUserComponent,
                        ConfigUsersComponent,
                    ],
                    exports: [
                        ConfigAlexaComponent,
                        ConfigDynatraceComponent,
                        ConfigSlackComponent,
                        ConfigUserComponent,
                        ConfigUsersComponent,
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                    ],
                    providers: [
                        ConfigService,
                    ],
                },] },
    ];
    ConfigModule.ctorParameters = [];
    return ConfigModule;
}());
//# sourceMappingURL=config.module.js.map