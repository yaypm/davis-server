// ============================================================================
// Config - SERVICE
//
// This service contains the primary functions that are used across all
// Config components.
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Injectable }   from "@angular/core";
import { Location }     from '@angular/common';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DavisService } from '../davis.service';

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Injectable()
export class ConfigService {
  // Initialize view
  view: string = "dynatrace";
  helpLinkText: string = 'How to complete this step';
  timezones: any = [];
  titleGlobal: string = '';
  isWizard: boolean = false;
  isSidebarVisible: boolean = false;
  
  status: any = {
    user: {
      error: null,
      success: null
    },
    users: {
      error: null,
      success: null
    },
    dynatrace: {
      error: null,
      success: null
    },
    alexa: {
      error: null,
      success: null
    },
    slack: {
      error: null,
      success: null
    }
  };
  
  values: any = {
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
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(private http: Http, public location: Location, public iDavis: DavisService) { }

  // ------------------------------------------------------
  // Select view in Wizard
  // ------------------------------------------------------
  selectView(newView: string) {
    this.view = newView;
    this.location.go(`/${ (this.isWizard) ? 'wizard' : 'configuration'}#${newView}`);
  }
  
  generateError(name: string, message: any) {
    this.status[name].success = false;
    this.status[name].error = message || 'Sorry an error occurred, please try again.';
  }
  
  getTimezones(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/users/timezones', options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  getDavisConfiguration(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`/api/v1/system/config/`, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  getDavisUsers(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`/api/v1/system/users`, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  updateDavisUser(user: any): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`/api/v1/system/users/${user.email}`, user, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  addDavisUser(user: any): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`/api/v1/system/users/${user.email}`, user, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  removeDavisUser(email: string): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(`/api/v1/system/users/${email}`, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  getDynatrace(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token } );
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/config/dynatrace', options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  connectDynatrace(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token } );
    let options = new RequestOptions({ headers: headers });

    return this.http.put('/api/v1/system/config/dynatrace', this.values.dynatrace, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  validateDynatrace(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token } );
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/config/dynatrace/validate', options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  connectAlexa(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`/api/v1/system/users/${this.values.user.email}`, { alexa_ids: this.values.user.alexa_ids }, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  getSlack(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get('/api/v1/system/config/slack', options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }

  connectSlack(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('/api/v1/system/config/slack', this.values.slack, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
  
  startSlack(): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.iDavis.token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/v1/system/config/slack/start', {}, options)
      .toPromise()
      .then(this.iDavis.extractData)
      .catch(this.iDavis.handleError);
  }
}
