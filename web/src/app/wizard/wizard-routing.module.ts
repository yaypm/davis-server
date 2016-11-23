import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigAlexaComponent }     from '../config-alexa/config-alexa.component';
import { ConfigDynatraceComponent } from '../config-dynatrace/config-dynatrace.component';
import { ConfigSlackComponent }     from '../config-slack/config-slack.component';
import { ConfigUserComponent }      from '../config-user/config-user.component';

const wizardRoutes: Routes = [
  {
    path: '',
    redirectTo: '/wizard',
    pathMatch: 'full'
  },
  {
    path: 'wizard',
    component: WizardComponent,
    children: [
      {
        path: 'config-alexa',
        component: ConfigAlexaComponent
      },
      {
        path: 'config-dynatrace',
        component: ConfigDynatraceComponent
      },
      {
        path: 'config-slack',
        component: ConfigSlackComponent
      },
      {
        path: 'config-user',
        component: ConfigUserComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(wizardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WizardRoutingModule { }