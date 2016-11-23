// ============================================================================
// Configuration - ROUTING
//
// This module handles all routing for the Configuration section
// ============================================================================
"use strict";
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
var router_1 = require("@angular/router");
// Components
var config_base_component_1 = require("./config-base/config-base.component");
// Services
// import { AuthGuard } from "../auth/auth-guard/auth-guard.service";
// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
var ConfigRoutes = [
    {
        path: "config",
        component: config_base_component_1.ConfigBaseComponent,
    },
];
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
exports.ConfigRouting = router_1.RouterModule.forChild(ConfigRoutes);
//# sourceMappingURL=config.routing.js.map