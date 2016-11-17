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
var http_1 = require('@angular/http');
var http_2 = require('@angular/http');
var WizardService = (function () {
    function WizardService(http) {
        this.http = http;
        this.values = {
            user: {
                email: null,
                password: null,
                passwordConfirmation: null,
                timezone: null,
                name: {
                    first: null,
                    last: null
                }
            },
            dynatrace: {
                url: null,
                token: null,
                strictSSL: true
            },
            alexa: {
                enabled: true,
                user: null
            },
            slack: {
                enabled: true,
                clientId: null,
                clientSecret: null,
                redirectUri: null
            },
            watson: {
                enabled: true,
                tts: {
                    user: null,
                    password: null
                },
                stt: {
                    user: null,
                    password: null
                }
            }
        };
        this.steps = [
            {
                title: 'Tell me about yourself?',
                name: 'user',
                path: 'src/step2',
                status: 'neutral'
            },
            {
                title: 'Let\'s connect to Dynatrace!',
                name: 'dynatrace',
                path: 'src/step3',
                status: 'neutral'
            },
            {
                title: 'Connect to Amazon Alexa',
                name: 'alexa',
                path: 'src/step4',
                status: 'neutral'
            },
            {
                title: 'Connect to Slack',
                name: 'slack',
                path: 'src/step5',
                status: 'neutral'
            },
            {
                title: 'Connect to Watson',
                name: 'web',
                path: 'src/step6',
                status: 'neutral'
            }
        ];
    }
    WizardService.prototype.getJwtToken = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post('/api/v1/authenticate', { email: 'admin@localhost', password: 'changeme' }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.addDavisUser = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post('/api/v1/system/users/${this.values.user.email}', this.values.user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.connectDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.connectAlexa = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put("/api/v1/system/user/" + this.values.user.email, this.values.alexa, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.connectSlack = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/slack', this.values.slack, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.connectWatson = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/watson', this.values.watson, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    WizardService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    WizardService.prototype.handleError = function (error) {
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
    WizardService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], WizardService);
    return WizardService;
}());
exports.WizardService = WizardService;
//# sourceMappingURL=wizard.service.js.map