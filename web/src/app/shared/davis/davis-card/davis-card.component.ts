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
  
  updated: boolean = false;
  updating: boolean = false;

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
    
  addToConvo(intent: string, name: string, value: string) {
    // Disabled card updating
    // if (intent !== 'pageRoute') 
    this.toggleProcessingIndicator.emit();
    this.iDavis.askDavisIntent(intent, name, value)
      .then(result => {
        if (!result.success) throw new Error(result.response);
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
        
        // Disabled card updating
        // if (intent === 'pageRoute') {
        //   this.updating = true;
        //   setTimeout(() => {
        //     this.updating = false;
        //     this.updated = true;
        //     this.message = result.response;
        //   }, 600);
        //   setTimeout(() => {
        //     this.iDavis.windowScrollBottom(1);
        //   }, 700);
        //   setTimeout(() => {
        //     this.updated = false;
        //   }, 1000);
        // } else {
          this.toggleProcessingIndicator.emit();
          this.iDavis.conversation.push(result.response);
          setTimeout(() => {
            this.iDavis.windowScrollBottom('slow');
          }, 100);
        // }
      })
      .catch(err => {
        if (typeof err !== 'string' && err.message) err = err.message;
        let message = { visual: { card: { text: err, error: true } }, isDavis: true };
        this.iDavis.conversation.push(message);
      });
  }

  doSubmit() {}
  
  ngOnInit() {}
}
