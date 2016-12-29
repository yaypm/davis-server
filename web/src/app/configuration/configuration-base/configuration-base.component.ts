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
          this.iConfig.SelectView(value);
        } else {
          this.iConfig.SelectView('user');
        }
      });

    this.iDavis.config['user'].success = null;
    this.iDavis.config['user'].error = null;
    this.iDavis.config['dynatrace'].success = null;
    this.iDavis.config['dynatrace'].error = null;
    this.iDavis.config['slack'].success = null;
    this.iDavis.config['slack'].error = null;

    this.iDavis.helpLinkText = 'Help for these settings';

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
          this.iDavis.generateError('user', result.message);
        }
      })
      .catch(err => {
        if (err.includes('invalid token')) {
          this.iDavis.logOut();
        }
      });

    this.iDavis.getDynatrace()
      .then(result => {
        if (result.success) {
          this.iDavis.values.dynatrace = result.dynatrace;
          this.iDavis.values.original.dynatrace = _.cloneDeep(this.iDavis.values.dynatrace);
        } else {
          this.iDavis.generateError('dynatrace', result.message);
        }
      })
      .catch(err => {
        if (err.includes('invalid token')) {
          this.iDavis.logOut();
        }
      });

    this.iDavis.getSlack()
      .then(result => {
        if (result.success) {
          this.iDavis.values.slack = result.slack;
          this.iDavis.values.slack.enabled = true;
          this.iDavis.values.original.slack = _.cloneDeep(this.iDavis.values.slack);
        } else {
          this.iDavis.generateError('slack', result.message);
        }
      })
      .catch(err => {
        if (err.includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
  }
}
