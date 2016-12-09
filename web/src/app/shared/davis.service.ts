import {Injectable}                from '@angular/core';
import { Router }                  from '@angular/router';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

declare var chrome: any;

@Injectable()
export class DavisService {

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;

  token: string;
  timezones: any = [];
  isWizard: boolean = false;
  titleGlobal: string = '';
  helpLinkText: string = 'How to complete this step';
  isChromeExtensionInstalled: boolean = chrome.app.isInstalled;

  values: any = {
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

  config: any = {
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

  constructor (private http: Http, private router: Router) {}
  
  logOut(): void {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.token = null;
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAdmin');
    this.router.navigate(["/auth/login"]);
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
  
  getDavisUser(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`/api/v1/system/users/${this.values.authenticate.email}`, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  
  getDavisUsers(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`/api/v1/system/users`, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  
  updateDavisUser(user: any): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`/api/v1/system/users/${user.email}`, user, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  addDavisUser(user: any): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`/api/v1/system/users/${user.email}`, user, options)
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

  getDynatrace(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token } );
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/config/dynatrace', options)
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

    return this.http.put(`/api/v1/system/users/${this.values.user.email}`, { alexa_ids: this.values.user.alexa_ids }, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  
  getSlack(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/config/slack', options)
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
  
  startSlack(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/v1/system/config/slack/start', {}, options)
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
  
  addToChrome(): void {
    chrome.webstore.install('https://chrome.google.com/webstore/detail/kighaljfkdkpbneahajiknoiinbckfpg', this.addToChomeSuccess, this.addToChomeFailure);
  }
  
  addToChomeSuccess(): void {}
  
  addToChomeFailure(err: string): void {
    window.open('https://chrome.google.com/webstore/detail/kighaljfkdkpbneahajiknoiinbckfpg');
  }
  
  clickElem(id: string): void {
    document.getElementById(id).click();
  }

  getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

}