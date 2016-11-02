"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var SidebarComponent = (function () {
    function SidebarComponent(route, router) {
        this.route = route;
        this.router = router;
        this.selectedPath = 'wizard/src/step1';
        this.steps = [
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
    }
    SidebarComponent.prototype.onSelect = function (step) {
        this.selectedPath = step.path;
        // Navigate with relative link
        this.router.navigate([step.path], { relativeTo: this.route });
    };
    SidebarComponent.prototype.isSelected = function (step) { return step.path === this.selectedPath; };
    SidebarComponent.prototype.ngOnInit = function () {
    };
    SidebarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router])
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map