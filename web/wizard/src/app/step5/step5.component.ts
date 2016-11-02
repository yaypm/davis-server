import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'step5',
    templateUrl: './step5.component.html',
    styleUrls: ['./step5.component.css']
})
export class Step5Component implements OnInit {

    myURL:string = '';
    
    constructor() {
       this.myURL = 'https://' + window.location.host;
    }
    
    ngOnInit() {}

}
