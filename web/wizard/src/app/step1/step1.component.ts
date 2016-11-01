import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { WizardService } from '../wizard.service';

@Component({
    moduleId: module.id,
    selector: 'step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.css'],
    providers: [WizardService]
})
export class Step1Component implements OnInit {
    
    submitted: boolean = false;
    
    constructor(private wizardService: WizardService) {}
    
    doLogin(loginForm: any) {
        console.log(loginForm.value);
        this.wizardService.getToken(loginForm.value.email, loginForm.value.password)
            .then( 
                response => {
                    this.token = response.token;
                    console.log('token: '+this.token);
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log(this.errorMessage);
                });
        this.submitted = true;
    }
    
    ngOnInit() {
    }

}
