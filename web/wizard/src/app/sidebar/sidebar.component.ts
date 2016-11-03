import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    
    selectedPath: any = 'wizard/src/step1';
  
    steps: Array<any> = [
        {
            title: 'Connect to MongoDB',
            name: 'mongo',
            path: 'wizard/src/step1'
        },
        {
            title: 'Create User',
            name: 'user',
            path: 'wizard/src/step2'
        },
        {
            title: 'Connect to Dynatrace',
            name: 'dynatrace',
            path: 'wizard/src/step3'
        },
        {
            title: 'Connect to Amazon Alexa',
            name: 'alexa',
            path: 'wizard/src/step4'
        },
        {
            title: 'Connect to Slack',
            name: 'slack',
            path: 'wizard/src/step5'
        },
        {
            title: 'Connect to Watson',
            name: 'web',
            path: 'wizard/src/step6'
        }
    ];
    
    constructor(private route: ActivatedRoute, private router: Router) {}
    
    ngOnInit() {
    }

}
