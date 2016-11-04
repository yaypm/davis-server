import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
  moduleId: module.id,
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component implements OnInit {

  submitted: boolean = false;
  buttonText: string = 'Skip & Finish';

  constructor(private wizardService: WizardService, private router: Router) {}
  
    validate() {
        if (this.wizardService.values.watson.stt.user) {
            this.buttonText = 'Finish';
        } else {
            this.buttonText = 'Skip & Finish';
        }
    }
  
    doSubmit() {
      if (this.wizardService.values.watson.stt.user) {
          this.wizardService.connectWatson()
            .then( 
                result => {
                    window.location.assign('https://' + window.location.host);
                },
                error => {
                    console.log(error);
                    this.wizardService.steps[5].status = 'failure';
                });
          this.submitted = true;
      } else {  
          window.location.assign('https://' + window.location.host);
      }
    }
    
    ngOnInit() {
        if (this.wizardService.steps[1].status !== 'success') {
            this.router.navigate(['wizard/src/step2']);
        } else if (this.wizardService.steps[2].status !== 'success') {
            this.router.navigate(['wizard/src/step3']);
        }
    }

}
