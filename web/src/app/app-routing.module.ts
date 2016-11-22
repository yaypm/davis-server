import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigUserComponent } from './config-user/config-user.component';
import { ConfigDynatraceComponent } from './config-dynatrace/config-dynatrace.component';
import { ConfigAlexaComponent } from './config-alexa/config-alexa.component';
import { ConfigSlackComponent } from './config-slack/config-slack.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'src/config-user', component: ConfigUserComponent },
            { path: 'src/config-dynatrace', component: ConfigDynatraceComponent },
            { path: 'src/config-alexa', component: ConfigAlexaComponent },
            { path: 'src/config-slack', component: ConfigSlackComponent },
            { path: 'src', component: ConfigUserComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
