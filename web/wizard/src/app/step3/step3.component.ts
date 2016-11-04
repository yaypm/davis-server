import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
  moduleId: module.id,
  selector: 'step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

  submitted: boolean = false;
    
  constructor(private wizardService: WizardService, private router: Router) {}
  
  doSubmit() {
      this.wizardService.connectDynatrace()
          .then( 
              result => {
                  this.wizardService.steps[2].status = 'success';
                  this.router.navigate(['wizard/src/step4']);
              },
              error => {
                  console.log(error);
                  this.wizardService.steps[2].status = 'failure';
              });
      this.submitted = true;
  }

  ngOnInit() {
        if (this.wizardService.steps[1].status !== 'success') {
            this.router.navigate(['wizard/src/step2']);
        }
  }

}
