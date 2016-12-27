// ============================================================================
// Davis Base - Component
//
// This component creates Davis landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { DavisService } from '../../shared/davis.service';
import * as _ from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    'davis-base',
  templateUrl: './davis-base.component.html',
})

export class DavisBaseComponent  {
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public router: Router, public iDavis: DavisService) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = true;
  }
}
