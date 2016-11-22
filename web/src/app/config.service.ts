import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ConfigService {
    
    token: string;
    timezones: any = [];
    isWizard: boolean = true;
    
    values: any = {
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
    
    steps: Array<any> = [
        {
            title: 'Create Admin Account',
            name: 'user',
            path: 'src/config-user',
            error: null,
            success: null
        },
        {
            title: 'Let\'s connect to Dynatrace!',
            name: 'dynatrace',
            path: 'src/config-dynatrace',
            error: null,
            success: null
        },
        {
            title: 'Connect to Amazon Alexa',
            name: 'alexa',
            path: 'src/config-alexa',
            error: null,
            success: null
        },
        {
            title: 'Connect to Slack',
            name: 'slack',
            path: 'src/config-slack',
            error: null,
            success: null
        }
    ];
    
    constructor (private http: Http) {
    }
    
    getJwtToken(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post('/api/v1/authenticate', { email: this.values.authenticate.email, password: this.values.authenticate.password }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    getTimezones(): Promise<any> {
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
      let options = new RequestOptions({ headers: headers });
    
      return this.http.get('/api/v1/system/users/timezones', options)
          .toPromise()
          .then(this.extractData)
          .catch(this.handleError);
    }
    
    addDavisUser(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post(`/api/v1/system/users/${this.values.user.email}`, this.values.user, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    removeDavisUser(email: string): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.delete(`/api/v1/system/users/${email}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    connectDynatrace(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token } );
        let options = new RequestOptions({ headers: headers });
  
        return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    validateDynatrace(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token } );
        let options = new RequestOptions({ headers: headers });
  
        return this.http.get('/api/v1/system/config/dynatrace/validate', options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    connectAlexa(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.put(`/api/v1/system/users/${this.values.user.email}`, { alexa_ids: this.values.alexa_ids }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    connectSlack(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.put('/api/v1/system/config/slack', this.values.slack, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
    
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }
    
    windowLocation(url:string): void {
      window.location.assign(url);
    }
    
    windowOpen(url:string): void {
      window.open(url);
    }
    
    getTimezone(): string {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

}