import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Component({
  moduleId: module.id,
  selector: 'config-dynatrace',
  templateUrl: './config-dynatrace.component.html',
  styleUrls: ['./config-dynatrace.component.css']
})
export class ConfigDynatraceComponent implements OnInit {

  submitted: boolean = false;
    
  constructor(private configService: ConfigService, private router: Router) {}
  
  doSubmit() {
    this.configService.connectDynatrace()
        .then(result => {
          if (result.success) {
            this.configService.validateDynatrace()
            .then(res => {
              if (res.success) {
                this.configService.steps[1].success = true;
                this.router.navigate([this.configService.steps[2].path]);
              } else {
                this.configService.steps[1].success = false;
                this.configService.steps[1].error = res.message;
              }
            },
            err => {
              this.configService.steps[1].success = false;
              this.configService.steps[1].error = 'Sorry an error occured, please try again.';
            });
          } else {
            this.configService.steps[1].success = false;
            this.configService.steps[1].error = result.message;
          }
        },
        error => {
          this.configService.steps[1].success = false;
          this.configService.steps[1].error = 'Sorry an error occured, please try again.';
        });
    this.submitted = true;
  }
  
  keySubmit(keyCode: any) {
    if (keyCode == 13) this.doSubmit();
  }

  ngOnInit() {
        if (!this.configService.steps[1].success) {
            this.router.navigate([this.configService.steps[1].path]);
        }
  }

}
