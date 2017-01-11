import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';

// Services
import { ConfigService } from '../../config/config.service';
import { DavisService }  from '../../davis.service';
import * as _ from "lodash";

@Component({
  selector: 'davis-card',
  templateUrl: './davis-card.component.html',
})
export class DavisCardComponent implements OnInit {
  
  @Input() message: any;
  @Input() isDavis: boolean;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
    
  addToConvo(phrase: string) {
    this.iDavis.askDavis(phrase)
      .then(result => {
        result.response.isDavis = true;
        this.iDavis.conversation.push(result.response);
        setTimeout(() => {
          this.iDavis.windowScrollBottom('slow');
        }, 100);
      })
      .catch(err => {
        let message = { visual: { text: err }, isDavis: true };
        this.iDavis.conversation.push(message);
      });
  }

  doSubmit() {}
  
  ngOnInit() {}
}
