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
                    this.router.navigate(['wizard/src/step2']);
                },
                error => {}
            );
    }
    
    ngOnInit() {
        if (this.wizardService.token) {
            this.router.navigate(['wizard/src/step2']);
        } else {
            this.getJwtToken();
        }
    }

}
