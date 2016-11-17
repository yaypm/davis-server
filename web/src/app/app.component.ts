import { Component } from '@angular/core';
import { Step2Component } from './step2/step2.component';
// Add the RxJS Observable operators.
import './rxjs-operators';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Davis Wizard';
}
