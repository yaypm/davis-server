import { Component, OnInit,
         AfterViewInit,
         Renderer,
         ViewChild } from '@angular/core';
import { Router }    from '@angular/router';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';
import * as _ from "lodash";
import * as Clipboard from 'clipboard';

@Component({
    selector: 'config-notification-source',
    templateUrl: './config-notification-source.component.html',
})
export class ConfigNotificationSourceComponent implements OnInit, AfterViewInit {
  
  webhookUrl: string = '';

  constructor(
    private renderer: Renderer,
    public iDavis: DavisService, 
    public iConfig: ConfigService, 
    public router: Router) {}

  doSubmit() {
  }

  ngOnInit() {
    this.iConfig.status['slack'].success = null;
    this.iDavis.isBreadcrumbsVisible = true;
    this.webhookUrl = `${window.location.protocol}//${window.location.host}${this.iConfig.values.notifications.uri}`;
  }
  
  ngAfterViewInit() {
    new Clipboard('.clipboard');
  }
}
