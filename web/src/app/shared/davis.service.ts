import {Injectable}                from '@angular/core';
import { Router }                  from '@angular/router';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import * as momentz from 'moment-timezone';

@Injectable()
export class DavisService {

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;

  token: string;
  isBreadcrumbsVisible: boolean = false;
  
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
    davisInput: '',
  };
  
  route_names: any = {
    '/wizard': 'Setup',
    '/configuration': 'Account settings',
  };

  constructor (private http: Http, private router: Router) {}
  
  logOut(): void {
    
    this.values.authenticate = {
      email: null,
      password: null,
    };
    
    this.values.user = {
      email: null,
      password: null,
      timezone: null,
      alexa_ids: null,
      name: {
          first: null,
          last: null
      },
      admin: false,
    };
    
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
  
  getDavisUser(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`/api/v1/system/users/${this.values.authenticate.email}`, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  extractData(res: Response): any {
    let body = res.json();
    return body || {};
  }

  handleError(error: Response | any): any {
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
    window.open('https://chrome.google.com/webstore/detail/kighaljfkdkpbneahajiknoiinbckfpg');
  }
  
  clickElem(id: string): void {
    document.getElementById(id).click();
  }

  getTimezone(): string {
    return momentz.tz.guess();
  }

}