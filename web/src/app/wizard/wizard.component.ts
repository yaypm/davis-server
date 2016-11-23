import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
    moduleId: module.id,
    selector: 'wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
    
    constructor(private configService: ConfigService, private router: Router) {}

    ngOnInit() {
     
    }

}