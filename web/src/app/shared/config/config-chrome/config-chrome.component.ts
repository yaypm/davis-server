import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService }  from '../../davis.service';
import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'config-chrome',
  templateUrl: './config-chrome.component.html',
})
export class ConfigChromeComponent implements OnInit{

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) {}
    
   ngOnInit() {}

}