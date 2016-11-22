import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  moduleId: module.id,
  selector: 'config-alexa',
  templateUrl: './config-alexa.component.html',
  styleUrls: ['./config-alexa.component.css']
})
export class ConfigAlexaComponent implements OnInit {

    submitted: boolean = false;
    buttonText: string = 'Skip';
    
    constructor(private configService: ConfigService, private router: Router) {}

    validate() {
        if (!this.configService.values.alexa_ids) {
            this.buttonText = 'Continue';
        } else {
            this.buttonText = 'Skip';
        }
    }
    
    doSubmit() {
        if (this.configService.values.alexa_ids) {
            this.configService.connectAlexa()
                .then(result => {
                    this.configService.steps[3].success = true;
                    this.router.navigate([this.configService.steps[3].path]);
                },
                error => {
                  console.log(error);
                  this.configService.steps[3].success = false;
                });
        } else {
            this.router.navigate([this.configService.steps[4]]);
        }
        this.submitted = true;
    }

    ngOnInit() {
        if (!this.configService.steps[1].success) {
            this.router.navigate([this.configService.steps[1].path]);
        } else if (!this.configService.steps[2].success) {
            this.router.navigate([this.configService.steps[2].path]);
        }
    }

}
