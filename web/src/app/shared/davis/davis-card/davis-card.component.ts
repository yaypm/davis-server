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
  @Output() toggleProcessingIndicator: EventEmitter<any> = new EventEmitter();

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
    
  addToConvo(intent: string, name: string, value: string) {
    this.toggleProcessingIndicator.emit();
    this.iDavis.askDavisIntent(intent, name, value)
      .then(result => {
        if (typeof result.response === 'string') {
          result.response = {
            visual: {
              card: {
                attachments: [
                  {
                    text: result.response,
                  },
                ],
              }
            },
            isDavis: true,
          };
        } else {
          result.response.isDavis = true;
        }
        result.response.timestamp = this.iDavis.getTimestamp();
        this.toggleProcessingIndicator.emit();
        this.iDavis.conversation.push(result.response);
        setTimeout(() => {
          this.iDavis.windowScrollBottom('slow');
        }, 100);
      })
      .catch(err => {
        let message = { visual: { card: { text: err } }, isDavis: true };
        this.iDavis.conversation.push(message);
      });
  }

  doSubmit() {}
  
  ngOnInit() {}
}
