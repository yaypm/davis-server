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
var router_1 = require('@angular/router');
// Components
var configuration_base_component_1 = require('./configuration-base/configuration-base.component');
// Services
var config_guard_service_1 = require('../auth/auth-guard/config-guard.service');
// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
var ConfigurationRoutes = [
    {
        path: 'configuration',
        component: configuration_base_component_1.ConfigurationBaseComponent,
        canActivate: [config_guard_service_1.ConfigGuard],
    },
];
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
exports.ConfigurationRouting = router_1.RouterModule.forChild(ConfigurationRoutes);
//# sourceMappingURL=configuration.routing.js.map