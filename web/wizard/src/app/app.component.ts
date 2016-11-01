import { Component } from '@angular/core';
import { Step1Component } from './step1/step1.component';
// Add the RxJS Observable operators.
import './rxjs-operators';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Davis Wizard';
}
