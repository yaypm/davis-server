import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WizardService } from './wizard.service';
import { Step1Component } from './step1/step1.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        Step1Component,
        SidebarComponent,
        Step2Component,
        Step3Component,
        Step4Component,
        Step5Component,
        Step6Component
    ],
    providers: [WizardService],
    bootstrap: [AppComponent]
})
export class AppModule {}
