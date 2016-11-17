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
    buttonText: string = 'Skip';
    
    constructor(private wizardService: WizardService, private router: Router) {}

    validate() {
        if (this.wizardService.values.alexa.user) {
            this.buttonText = 'Continue';
        } else {
            this.buttonText = 'Skip';
        }
    }
    
    doSubmit() {
        if (this.wizardService.values.alexa.user) {
            this.wizardService.connectAlexa()
                .then( 
                    result => {
                        this.wizardService.steps[3].status = 'success';
                        this.router.navigate(['src/step5']);
                    },
                    error => {
                      console.log(error);
                      this.wizardService.steps[3].status = 'failure';
                    });
        } else {
            this.router.navigate(['src/step5']);
        }
        this.submitted = true;
    }

    ngOnInit() {
        if (this.wizardService.steps[1].status !== 'success') {
            this.router.navigate(['src/step2']);
        } else if (this.wizardService.steps[2].status !== 'success') {
            this.router.navigate(['src/step3']);
        }
    }

}
