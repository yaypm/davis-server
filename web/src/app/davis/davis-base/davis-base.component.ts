// ============================================================================
// Davis Base - Component
//
// This component creates Davis landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';
import { ConfigService }          from '../../shared/config/config.service';
import { DavisService }           from '../../shared/davis.service';
import * as _                     from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    'davis-base',
  templateUrl: './davis-base.component.html',
})

export class DavisBaseComponent implements OnInit {
  
  isDavisInputFocused: boolean = false;
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public router: Router, public iConfig: ConfigService, public iDavis: DavisService) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  
  doSubmit() {
    
  }
  
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = true;
    
    if (!this.iDavis.values.user.email) {
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
    }
  }
}
