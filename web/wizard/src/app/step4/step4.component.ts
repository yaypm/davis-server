import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
  moduleId: module.id,
  selector: 'step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {

    submitted: boolean = false;
    buttonText: string = 'Next';
    
    constructor(private wizardService: WizardService, private router: Router) {}

    validate() {
        if (this.wizardService.values.alexa.user) {
            this.buttonText = 'Next';
        } else {
            this.buttonText = 'Skip';
        }
    }
    
    doSubmit() {
        this.wizardService.connectAlexa()
            .then( 
                result => {
                  this.router.navigate(['wizard/src/step5']);
                },
                error => {
                  console.log(error);
                });
        this.submitted = true;
    }

    ngOnInit() {
        if (!this.wizardService.values.user.name.first) {
            this.router.navigate(['wizard/src/step2']);
        } else if (!this.wizardService.values.dynatrace.url) {
            this.router.navigate(['wizard/src/step3']);
        }
    }

}
