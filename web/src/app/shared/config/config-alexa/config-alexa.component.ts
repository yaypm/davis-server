import { Component, OnInit } from '@angular/core';

// Services
import { ConfigService } from '../config.service';
import { DavisService }  from '../../davis.service';

@Component({
  moduleId: module.id,
  selector: 'config-alexa',
  templateUrl: './config-alexa.component.html',
})
export class ConfigAlexaComponent implements OnInit {
  submitted: boolean = false;
  submitButton: string = (this.iDavis.isWizard) ? 'Skip' : 'Save';

  constructor(
    public iDavis: DavisService,
    public iConfig: ConfigService) { }

  validate() {
    if (this.iDavis.values.user.alexa_ids) {
      this.submitButton = 'Continue';
    } else {
      this.submitButton = 'Skip';
    }
  }

  doSubmit() {
    if (this.iDavis.values.user.alexa_ids) {
      this.submitButton = 'Saving...';
      this.iDavis.connectAlexa()
        .then(result => {
          this.iDavis.config['alexa'].success = true;
          this.iConfig.SelectView('slack');
        },
        error => {
          console.log(error);
          this.iDavis.config['alexa'].success = false;
        });
    } else {
      this.iConfig.SelectView('slack');
    }

    this.submitted = true;
  }
  
  ngOnInit() {
    document.getElementsByName('alexa')[0].focus();
  }
}
