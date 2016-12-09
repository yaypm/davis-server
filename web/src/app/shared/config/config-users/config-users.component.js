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
var davis_service_1 = require('../../davis.service');
var _ = require("lodash");
var ConfigUsersComponent = (function () {
    function ConfigUsersComponent(iDavis, router) {
        this.iDavis = iDavis;
        this.router = router;
        this.submitted = false;
        this.submitButton = 'Save';
        this.isPasswordFocused = false;
        this.isPasswordMasked = true;
        this.addUser = true;
        this.editUser = false;
        this.users = [];
        this.backImg = '/assets/img/back.svg';
        this.backImgHover = '/assets/img/back-hover.svg';
        this.filterName = '';
    }
    ConfigUsersComponent.prototype.addMode = function () {
        this.iDavis.values.otherUser = {
            email: null,
            password: null,
            timezone: null,
            alexa_ids: null,
            name: {
                first: null,
                last: null
            },
            admin: false
        };
        this.iDavis.values.otherUser.timezone = this.iDavis.getTimezone();
        this.iDavis.values.original.otherUser = _.cloneDeep(this.iDavis.values.otherUser);
        this.filterName = '';
    };
    ConfigUsersComponent.prototype.editMode = function (user) {
        this.editUser = true;
        this.iDavis.values.original.otherUser = user;
        this.iDavis.values.otherUser = _.cloneDeep(user);
        this.filterName = '';
    };
    ConfigUsersComponent.prototype.getUsers = function () {
        var _this = this;
        this.iDavis.getDavisUsers()
            .then(function (response) {
            _this.iDavis.values.users = response.users;
            _.remove(_this.iDavis.values.users, function (user) {
                return user.email === _this.iDavis.values.user.email;
            });
            _this.users = _.cloneDeep(response.users);
        }, function (error) {
            _this.iDavis.config['users'].success = false;
            _this.iDavis.config['users'].error = 'Unable to get users, please try again later.';
        })
            .catch(function (err) {
            if (err.includes('invalid token')) {
                _this.iDavis.logOut();
            }
        });
    };
    ConfigUsersComponent.prototype.updateFilter = function (input) {
        this.filterName = input.value;
    };
    ConfigUsersComponent.prototype.ngOnInit = function () {
        this.getUsers();
    };
    ConfigUsersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'config-users',
            templateUrl: './config-users.component.html',
        }), 
        __metadata('design:paramtypes', [davis_service_1.DavisService, router_1.Router])
    ], ConfigUsersComponent);
    return ConfigUsersComponent;
}());
exports.ConfigUsersComponent = ConfigUsersComponent;
//# sourceMappingURL=config-users.component.js.map