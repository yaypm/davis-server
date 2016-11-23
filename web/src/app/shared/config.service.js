import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
export var ConfigService = (function () {
    function ConfigService(http) {
        this.http = http;
        this.isAdmin = false;
        this.isAuthenticated = false;
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
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var options = new RequestOptions({ headers: headers });
        return this.http.post('/api/v1/authenticate', { email: this.values.authenticate.email, password: this.values.authenticate.password }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.getTimezones = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/users/timezones', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.addDavisUser = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.post("/api/v1/system/users/" + this.values.user.email, this.values.user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.removeDavisUser = function (email) {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.delete("/api/v1/system/users/" + email, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectDynatrace = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.validateDynatrace = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.get('/api/v1/system/config/dynatrace/validate', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectAlexa = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
        return this.http.put("/api/v1/system/users/" + this.values.user.email, { alexa_ids: this.values.alexa_ids }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ConfigService.prototype.connectSlack = function () {
        var headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        var options = new RequestOptions({ headers: headers });
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
        if (error instanceof Response) {
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
    ConfigService.decorators = [
        { type: Injectable },
    ];
    ConfigService.ctorParameters = [
        { type: Http, },
    ];
    return ConfigService;
}());
//# sourceMappingURL=config.service.js.map