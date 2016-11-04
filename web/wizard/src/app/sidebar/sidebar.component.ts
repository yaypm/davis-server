import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WizardService } from '../wizard.service';

@Component({
    moduleId: module.id,
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    
    constructor(private wizardService: WizardService, private route: ActivatedRoute, private router: Router) {}
    
    ngOnInit() {
    }

}
