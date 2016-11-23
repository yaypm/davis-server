// ============================================================================
// Auth - ROUTING
//
// This module handles all routing for the Auth section
// ============================================================================
"use strict";
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
var router_1 = require("@angular/router");
// Components
var auth_login_component_1 = require("./auth-login/auth-login.component");
// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
var AuthRoutes = [
    {
        children: [
            {
                component: auth_login_component_1.AuthLoginComponent,
                path: "login",
            },
        ],
        path: "auth",
    },
];
// ----------------------------------------------------------------------------
// Module
// ----------------------------------------------------------------------------
exports.AuthRouting = router_1.RouterModule.forChild(AuthRoutes);
//# sourceMappingURL=auth.routing.js.map