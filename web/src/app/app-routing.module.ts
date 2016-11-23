import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { WizardModule } from './wizard/wizard-routing.module';

@NgModule({
    imports: [
        WizardModule
    ],
    exports: [
        RouterModule
    ],
    bootstrap: [ AppComponent ]
})
export class AppRoutingModule { }
