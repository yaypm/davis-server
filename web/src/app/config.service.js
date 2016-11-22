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
var ConfigService = (function () {
    function ConfigService(http) {
        this.http = http;
        this.timezones = [];
        this.isWizard = true;
        this.values = {
            authenticate: {
                email: null,
                password: null
            },
            user: {
                email: null,
                password: null,
                timezone: null,
                name: {
                    first: null,
                    last: null
                },
                admin: false
            },
            dynatrace: {
                url: null,
                token: null,
                strictSSL: true
            },
            alexa_ids: null,
            slack: {
                enabled: true,
                clientId: null,
                clientSecret: null,
                redirectUri: null
            }
        };
        this.config = {
            user: {
                title: 'Create Admin Account',
                name: 'user',
                path: 'src/config-user',
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
                title: 'Connect to Amazon Alexa',
                name: 'alexa',
                path: 'src/config-alexa',
                error: null,
                success: null
            },
            slack: {
                title: 'Connect to Slack',
                name: 'slack',
                path: 'src/config-slack',
                error: null,
                success: null
            }
        };
    }
    ConfigService.prototype.getJwtToken = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post('/api/v1/authenticate', { email: this.values.authenticate.email, password: this.values.authenticate.password }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.getTimezones = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/users/timezones', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.addDavisUser = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.post("/api/v1/system/users/" + this.values.user.email, this.values.user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.removeDavisUser = function (email) {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.delete("/api/v1/system/users/" + email, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.validateDynatrace = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/config/dynatrace/validate', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectAlexa = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put("/api/v1/system/users/" + this.values.user.email, { alexa_ids: this.values.alexa_ids }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectSlack = function () {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new http_2.RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/slack', this.values.slack, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    ConfigService.prototype.handleError = function (error) {
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
    ConfigService.prototype.windowLocation = function (url) {
        window.location.assign(url);
    };
    ConfigService.prototype.windowOpen = function (url) {
        window.open(url);
    };
    ConfigService.prototype.getTimezone = function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };
    ConfigService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ConfigService);
    return ConfigService;
}());
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map