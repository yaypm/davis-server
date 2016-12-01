import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService } from '../../davis.service';

@Component({
  moduleId: module.id,
  selector: 'config-dynatrace',
  templateUrl: './config-dynatrace.component.html',
})
export class ConfigDynatraceComponent implements OnInit {

  submitted: boolean = false;
  submitButton: string = (this.iDavis.isWizard) ? 'Continue' : 'Save';
    
  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
  
  doSubmit() {
    this.submitButton = 'Saving...';
    this.iDavis.connectDynatrace()
        .then(result => {
          if (result.success) {
            this.iDavis.validateDynatrace()
            .then(res => {
              if (res.success) {
                this.iDavis.config['dynatrace'].success = true;
                this.iConfig.SelectView('alexa');
              } else {
                this.iDavis.config['dynatrace'].success = false;
                this.iDavis.config['dynatrace'].error = res.message;
              }
            },
            err => {
              this.iDavis.config['dynatrace'].success = false;
              this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
            });
          } else {
            this.iDavis.config['dynatrace'].success = false;
            this.iDavis.config['dynatrace'].error = result.message;
          }
        },
        error => {
          this.iDavis.config['dynatrace'].success = false;
          this.iDavis.config['dynatrace'].error = 'Sorry an error occurred, please try again.';
        });
    this.submitted = true;
  }
  
  keySubmit(keyCode: any) {
    if (keyCode === 13) {
      this.doSubmit();
    }
  }
  
  ngOnInit() {
    document.getElementsByName('url')[0].focus();
  }
}
