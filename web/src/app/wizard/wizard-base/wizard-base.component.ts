// ============================================================================
// Wizard Base - COMPONENT
//
// This component creates the Wizard landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component } from "@angular/core";

// Services
import { WizardService } from "../wizard.service";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  moduleId:    module.id,
  selector:    "wizard-base",
  templateUrl: "./wizard-base.component.html",
})

export class WizardBaseComponent {
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public iWizard: WizardService) {}
}
