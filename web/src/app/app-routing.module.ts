import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'src/step2', component: Step2Component },
            { path: 'src/step3', component: Step3Component },
            { path: 'src/step4', component: Step4Component },
            { path: 'src/step5', component: Step5Component },
            { path: 'src/step6', component: Step6Component },
            { path: 'src', component: Step2Component }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
