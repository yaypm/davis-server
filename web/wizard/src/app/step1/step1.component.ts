import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
    moduleId: module.id,
    selector: 'step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.css'],
})
export class Step1Component implements OnInit {
    
    success: boolean = true;
    
    constructor(private wizardService: WizardService, private router: Router) {}
    
    getJwtToken() {
        this.wizardService.getJwtToken()
            .then( 
                response => {
                    this.wizardService.token = response.token;
                    setTimeout( () => {
                        this.router.navigate(['wizard/src/step2']);
                    }, 1000);
                },
                error => {
                    console.log(error);
                    this.wizardService.steps[0].status = 'failure';
                }
            );
    }
    
    ngOnInit() {
        if (this.wizardService.token) {
            this.router.navigate(['wizard/src/step2']);
        } else {
            this.wizardService.steps[0].status = 'success';
            this.getJwtToken();
        }
    }

}
