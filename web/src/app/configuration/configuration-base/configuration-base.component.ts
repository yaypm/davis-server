// ============================================================================
// Config Base - Component
//
// This component creates Configuration landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { ConfigService } from '../../shared/config/config.service';
import { DavisService } from '../../shared/davis.service';
import * as _ from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    'configuration-base',
  templateUrl: './configuration-base.component.html',
})

export class ConfigurationBaseComponent  {
  
  showConfigureButton: boolean = false;
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public router: Router, public iConfig: ConfigService, public iDavis: DavisService) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    if (sessionStorage.getItem('wizard-finished')) {
      sessionStorage.removeItem('wizard-finished');
      this.iDavis.titleGlobal = 'Great! It looks like we\'re all set now.';
      this.showConfigureButton = true;
    } else {
      this.iDavis.titleGlobal = 'Configure Davis';
    }
    
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
          this.iDavis.values.original.user = _.cloneDeep(this.iDavis.values.user);
        } else {
          this.iDavis.config['user'].error = result.message;
        }
      })
      .catch(err => {
        this.iDavis.config['user'].error = err.message;
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
          this.iDavis.config['dynatrace'].error = result.message;
        }
      })
      .catch(err => {
        this.iDavis.config['dynatrace'].error = err.message;
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
          this.iDavis.config['slack'].error = result.message;
        }
      })
      .catch(err => {
        this.iDavis.config['slack'].error = err.message;
        if (err.includes('invalid token')) {
          this.iDavis.logOut();
        }
      });
  }
}
