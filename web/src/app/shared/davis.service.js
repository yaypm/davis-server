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
var http_1 = require('@angular/http');
var http_2 = require('@angular/http');
var DavisService = (function () {
    function DavisService(http, router) {
        this.http = http;
        this.router = router;
        this.isAdmin = false;
        this.isAuthenticated = false;
        this.timezones = [];
        this.isWizard = false;
        this.titleGlobal = '';
        this.helpLinkText = 'How to complete this step';
        this.isChromeExtensionInstalled = chrome.app.isInstalled;
        this.values = {
            authenticate: {
                email: null,
                password: null
            },
            user: {
                email: null,
                password: null,
                timezone: null,
                alexa_ids: null,
                name: {
                    first: null,
                    last: null
                },
                admin: false
            },
            otherUser: {
                email: null,
                password: null,
                timezone: null,
                alexa_ids: null,
                name: {
                    first: null,
                    last: null
                },
                admin: false
            },
            users: [],
            dynatrace: {
                url: null,
                token: null,
                strictSSL: true
            },
            slack: {
                enabled: true,
                clientId: null,
                clientSecret: null,
                redirectUri: null
            },
            original: {
                user: {},
                otherUser: {},
                dynatrace: {},
                slack: {}
            }
        };
        this.config = {
            user: {
                title: 'My Account',
                name: 'user',
                path: 'src/config-user',
                error: null,
                success: null
            },
            users: {
                title: 'User Accounts',
                name: 'users',
                path: 'src/config-users',
                error: null,
                success: null
            },
            dynatrace: {
                title: 'Let\'s connect to Dynatrace!',
                name: 'dynatrace',
                path: 'src/config-dynatrace',
                error: null,
                success: null
            },
            alexa: {
                title: 'Alexa',
                name: 'alexa',
                path: 'src/config-alexa',
                error: null,
                success: null
            },
            slack: {
                title: 'Slack App',
                name: 'slack',
                path: 'src/config-slack',
                error: null,
                success: null
            }
        };
    }
    DavisService.prototype.logOut = function () {
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.token = null;
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');
        this.router.navigate(["/auth/login"]);
    };
    DavisService.prototype.getJwtToken = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post('/api/v1/authenticate', { email: this.values.authenticate.email, password: this.values.authenticate.password }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.getTimezones = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/users/timezones', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.getDavisUser = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get("/api/v1/system/users/" + this.values.authenticate.email, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.getDavisUsers = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get("/api/v1/system/users", options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.updateDavisUser = function (user) {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put("/api/v1/system/users/" + user.email, user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.addDavisUser = function (user) {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post("/api/v1/system/users/" + user.email, user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.removeDavisUser = function (email) {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.delete("/api/v1/system/users/" + email, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.getDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/config/dynatrace', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.connectDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.validateDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/config/dynatrace/validate', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.connectAlexa = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put("/api/v1/system/users/" + this.values.user.email, { alexa_ids: this.values.user.alexa_ids }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.getSlack = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/config/slack', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.connectSlack = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/slack', this.values.slack, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.startSlack = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post('/api/v1/system/config/slack/start', {}, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DavisService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    DavisService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    };
    DavisService.prototype.windowLocation = function (url) {
        window.location.assign(url);
    };
    DavisService.prototype.windowOpen = function (url) {
        window.open(url);
    };
    DavisService.prototype.addToChrome = function () {
        chrome.webstore.install('https://chrome.google.com/webstore/detail/kighaljfkdkpbneahajiknoiinbckfpg', this.addToChomeSuccess, this.addToChomeFailure);
    };
    DavisService.prototype.addToChomeSuccess = function () { };
    DavisService.prototype.addToChomeFailure = function (err) {
        window.open('https://chrome.google.com/webstore/detail/kighaljfkdkpbneahajiknoiinbckfpg');
    };
    DavisService.prototype.clickElem = function (id) {
        document.getElementById(id).click();
    };
    DavisService.prototype.getTimezone = function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };
    DavisService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, router_1.Router])
    ], DavisService);
    return DavisService;
}());
exports.DavisService = DavisService;
//# sourceMappingURL=davis.service.js.map