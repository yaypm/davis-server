import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Services
import { ConfigService } from '../../config/config.service';
import { DavisService }  from '../../davis.service';
import * as _ from "lodash";

@Component({
  selector: 'davis-card',
  templateUrl: './davis-card.component.html',
})
export class DavisCardComponent implements OnInit {
  
  @Input() message: string;
  @Input() isDavis: boolean;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }

  doSubmit() {
  
  }
  
  ngOnInit() {
  }
}
