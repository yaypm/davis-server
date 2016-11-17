import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class WizardService {
    
    token: string;
    
    values: any = {
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
    
    steps: Array<any> = [
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
    
    constructor (private http: Http) {
    }
    
    getJwtToken(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post('/api/v1/authenticate', { email: 'admin@localhost', password: 'changeme' }, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    addDavisUser(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.post('/api/v1/system/users/${this.values.user.email}', this.values.user, options)
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
    
    connectAlexa(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.put(`/api/v1/system/user/${this.values.user.email}`, this.values.alexa, options)
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
    
    connectWatson(): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
        let options = new RequestOptions({ headers: headers });
  
        return this.http.put('/api/v1/system/config/watson', this.values.watson, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
    
    private handleError (error: Response | any) {
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

}