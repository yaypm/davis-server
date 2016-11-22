import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigService } from './config.service';
import { ConfigUserComponent } from './config-user/config-user.component';
import { ConfigDynatraceComponent } from './config-dynatrace/config-dynatrace.component';
import { ConfigAlexaComponent } from './config-alexa/config-alexa.component';
import { ConfigSlackComponent } from './config-slack/config-slack.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ConfigUserComponent,
        ConfigDynatraceComponent,
        ConfigAlexaComponent,
        ConfigSlackComponent
    ],
    providers: [ConfigService],
    bootstrap: [AppComponent]
})
export class AppModule {}
