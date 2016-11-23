// ============================================================================
// Wizard - ROUTING
//
// This module handles all routing for the Wizard section
// ============================================================================
"use strict";
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
var router_1 = require("@angular/router");
// Components
var wizard_base_component_1 = require("./wizard-base/wizard-base.component");
// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
var WizardRoutes = [
    {
        path: "",
        redirectTo: "/wizard",
        pathMatch: "full"
    },
    {
        path: "wizard",
        component: wizard_base_component_1.WizardBaseComponent,
    },
];
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
exports.WizardRouting = router_1.RouterModule.forChild(WizardRoutes);
//# sourceMappingURL=wizard.routing.js.map