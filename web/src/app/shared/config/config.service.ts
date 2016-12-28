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

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Injectable()
export class ConfigService {
  // Initialize view
  view: string = "dynatrace";
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public location: Location) { }

  // ------------------------------------------------------
  // Select view in Wizard
  // ------------------------------------------------------
  SelectView(newView: string) {
    this.view = newView;
    this.location.go(`/configuration#${newView}`);
  }
}
