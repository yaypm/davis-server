import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
    moduleId: module.id,
    selector: 'step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {
    
    submitted: boolean = false;
    
    constructor(private wizardService: WizardService, private router: Router) {}
    
    doSubmit() {
        this.wizardService.addDavisUser()
            .then( 
                result => {
                    this.router.navigate(['wizard/src/step3']);
                },
                error => {
                    console.log(error);
                });
        this.submitted = true;
    }
    
    ngOnInit() {
    }

}