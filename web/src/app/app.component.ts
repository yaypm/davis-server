import { Component } from '@angular/core';
// Add the RxJS Observable operators.
import './rxjs-operators';
import { ConfigService } from './config.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private configService: ConfigService) {}
}