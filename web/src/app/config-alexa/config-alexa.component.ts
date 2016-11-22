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
        if (this.configService.values.alexa_ids) {
            this.buttonText = 'Continue';
        } else {
            this.buttonText = 'Skip';
        }
    }
    
    doSubmit() {
        if (this.configService.values.alexa_ids) {
            this.configService.connectAlexa()
                .then(result => {
                    this.configService.config['alexa'].success = true;
                    this.router.navigate([this.configService.config['slack'].path]);
                },
                error => {
                  console.log(error);
                  this.configService.config['alexa'].success = false;
                });
        } else {
            this.router.navigate([this.configService.config['slack'].path]);
        }
        this.submitted = true;
    }

    ngOnInit() {
        if (!this.configService.config['user'].success) {
            this.router.navigate([this.configService.config['user'].path]);
        } else if (!this.configService.config['dynatrace'].success) {
            this.router.navigate([this.configService.config['dynatrace'].path]);
        }
    }

}
