import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'wizard/src/step1', component: Step1Component },
            { path: 'wizard/src/step2', component: Step2Component },
            { path: 'wizard/src/step3', component: Step3Component },
            { path: 'wizard/src/step4', component: Step4Component },
            { path: 'wizard/src/step5', component: Step5Component },
            { path: 'wizard/src/step6', component: Step6Component },
            { path: 'wizard/src', component: Step1Component }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
