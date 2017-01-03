// ============================================================================
// Config Base - Component
//
// This component creates Configuration landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component, OnInit, Pipe, PipeTransform }   from '@angular/core';
import { Location }                                 from '@angular/common';
import { Router, ActivatedRoute }                   from '@angular/router';
import { Observable }                               from 'rxjs/Observable';
import { ConfigService }                            from '../../shared/config/config.service';
import { DavisService }                             from '../../shared/davis.service';
import * as _                                       from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    'configuration-base',
  providers: [Location],
  templateUrl: './configuration-base.component.html',
})

export class ConfigurationBaseComponent implements OnInit {
  sidebarItems: any = {
    user: {
      key:  'user',
      name: 'My Account',
      admin: false,
    },
    users: {
      key: 'users',
      name: 'User Accounts',
      admin: true,
    },
    dynatrace: {
      key: 'dynatrace',
      name: 'Dynatrace',
      admin: true,
    },
    slack: {
      key: 'slack',
      name: 'Slack App',
      admin: true,
    },
    chrome: {
      key: 'chrome',
      name: 'Chrome Extension',
      admin: false,
    },
  };

  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public location: Location,
    public iConfig: ConfigService,
    public iDavis: DavisService
  ) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = true;

    this.route
      .fragment
      .map(fragment => fragment || 'None')
      .subscribe(value => {
        if (this.sidebarItems[value]) {
          this.iConfig.selectView(value);
        } else {
          this.iConfig.selectView('user');
        }
      });
    
    this.iConfig.status['user'].success = null;
    this.iConfig.status['user'].error = null;
    this.iConfig.status['dynatrace'].success = null;
    this.iConfig.status['dynatrace'].error = null;
    this.iConfig.status['slack'].success = null;
    this.iConfig.status['slack'].error = null;
  
    this.iConfig.helpLinkText = 'Help for these settings';  
  
    this.iDavis.getDavisUser()
      .then(result => {
        if (result.success) {
          this.iDavis.values.user = result.user;
          if (!result.user.name) {
            this.iDavis.values.user.name = {first:'',last:''};
          } else {
            if (!result.user.name.first) this.iDavis.values.user.name.first = '';
            if (!result.user.name.last) this.iDavis.values.user.name.last = '';
          }
          this.iDavis.values.original.user = _.cloneDeep(this.iDavis.values.user);
        } else {
          this.iConfig.generateError('user', result.message);
        }
      })
      .catch(err => {
        if (JSON.stringify(err).includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
      
    this.iConfig.getDynatrace()
      .then(result => {
        if (result.success) {
          this.iConfig.values.dynatrace = result.dynatrace;
          this.iConfig.values.original.dynatrace = _.cloneDeep(this.iConfig.values.dynatrace);
        } else {
          this.iConfig.generateError('dynatrace', result.message);
        }
      })
      .catch(err => {
        if (JSON.stringify(err).includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
      
    this.iConfig.getSlack()
      .then(result => {
        if (result.success) {
          this.iConfig.values.slack = result.slack;
          this.iConfig.values.slack.enabled = true;
          this.iConfig.values.original.slack = _.cloneDeep(this.iConfig.values.slack);
        } else {
          this.iConfig.generateError('slack', result.message);
        }
      })
      .catch(err => {
        if (JSON.stringify(err).includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
  }
}
