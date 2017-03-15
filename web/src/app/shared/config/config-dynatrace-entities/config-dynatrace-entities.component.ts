import { Component, OnInit,
         Input,
         AfterViewInit,
         ElementRef,
         Renderer,
         ViewChild }      from '@angular/core';

// Services
import { ConfigService }  from '../config.service';
import { DavisService }   from '../../davis.service';
import * as _ from "lodash";

@Component({
  selector: 'config-dynatrace-entities',
  templateUrl: './config-dynatrace-entities.component.html',
})
export class ConfigDynatraceEntitiesComponent implements OnInit, AfterViewInit {

  @Input() category: string;
  
  submitted: boolean = false;
  submitButton: string = 'Save';
  isDirty: boolean = false;
  isAdvancedExpanded: boolean = false;
  isSSL: boolean = false;

  constructor(
    private renderer: Renderer,
    public iDavis: DavisService,
    public iConfig: ConfigService) { }

  doSubmit() {
    this.submitted = true;
    this.submitButton = 'Saving...';
   
    // this.iConfig.connectDynatrace()
    //   .then(response => {
    //     if (!response.success) {
    //       this.resetSubmitButton(); 
    //       throw new Error(response.message); 
    //     }
        
    //     this.iConfig.status['entities'].success = true;
    //     if (this.iConfig.isWizard) {
    //       this.iConfig.selectView('user');
    //     } else {
    //       this.resetSubmitButton();
    //     }
    //   })
    //   .catch(err => {
    //     this.iConfig.displayError(err, 'dynatrace');
    //   });
  }

  validate() {
    this.isDirty = !_.isEqual(this.iConfig.values.entities, this.iConfig.values.original.entities);
  }

  resetSubmitButton() {
    this.submitButton = (this.iConfig.isWizard) ? 'Continue' : 'Save';
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
  }
}
