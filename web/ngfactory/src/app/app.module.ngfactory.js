var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '@angular/core/src/linker/ng_module_factory';
import * as import1 from '../../../src/app/app.module';
import * as import2 from '@angular/router/src/router_module';
import * as import3 from '@angular/common/src/common_module';
import * as import4 from '@angular/forms/src/directives';
import * as import5 from '@angular/forms/src/form_providers';
import * as import6 from '../../../src/app/auth/auth.module';
import * as import7 from '@angular/core/src/application_module';
import * as import8 from '@angular/platform-browser/src/browser';
import * as import9 from '../../../src/app/shared/config/config.module';
import * as import10 from '../../../src/app/configuration/configuration.module';
import * as import11 from '@angular/http/src/http_module';
import * as import12 from '../../../src/app/wizard/wizard.module';
import * as import13 from '@angular/common/src/localization';
import * as import14 from '@angular/forms/src/directives/radio_control_value_accessor';
import * as import15 from '@angular/core/src/application_init';
import * as import16 from '@angular/core/src/testability/testability';
import * as import17 from '@angular/core/src/application_ref';
import * as import18 from '@angular/core/src/linker/compiler';
import * as import19 from '@angular/platform-browser/src/dom/events/hammer_gestures';
import * as import20 from '@angular/platform-browser/src/dom/events/event_manager';
import * as import21 from '@angular/platform-browser/src/dom/shared_styles_host';
import * as import22 from '@angular/platform-browser/src/dom/dom_renderer';
import * as import23 from '@angular/platform-browser/src/security/dom_sanitization_service';
import * as import24 from '@angular/core/src/linker/view_utils';
import * as import25 from '@angular/platform-browser/src/browser/title';
import * as import26 from '../../../src/app/shared/config/config.service';
import * as import27 from '@angular/http/src/backends/browser_xhr';
import * as import28 from '@angular/http/src/base_response_options';
import * as import29 from '@angular/http/src/backends/xhr_backend';
import * as import30 from '@angular/http/src/base_request_options';
import * as import31 from '@angular/http/src/backends/browser_jsonp';
import * as import32 from '@angular/http/src/backends/jsonp_backend';
import * as import33 from '@angular/common/src/location/location';
import * as import34 from '@angular/router/src/url_tree';
import * as import35 from '@angular/router/src/router_outlet_map';
import * as import36 from '@angular/core/src/linker/system_js_ng_module_factory_loader';
import * as import37 from '@angular/router/src/router_preloader';
import * as import38 from '../../../src/app/shared/davis.service';
import * as import39 from '../../../src/app/auth/auth-guard/wizard-guard.service';
import * as import41 from './auth/auth-login/auth-login.component.ngfactory';
import * as import42 from './configuration/configuration-base/configuration-base.component.ngfactory';
import * as import43 from './wizard/wizard-base/wizard-base.component.ngfactory';
import * as import44 from './app.component.ngfactory';
import * as import45 from '../../../src/app/auth/auth-login/auth-login.component';
import * as import46 from '../../../src/app/configuration/configuration-base/configuration-base.component';
import * as import47 from '../../../src/app/wizard/wizard-base/wizard-base.component';
import * as import48 from '@angular/core/src/application_tokens';
import * as import49 from '@angular/platform-browser/src/dom/events/dom_events';
import * as import50 from '@angular/platform-browser/src/dom/events/key_events';
import * as import51 from '@angular/core/src/zone/ng_zone';
import * as import52 from '@angular/platform-browser/src/dom/debug/ng_probe';
import * as import53 from '@angular/common/src/location/platform_location';
import * as import54 from '@angular/common/src/location/location_strategy';
import * as import55 from '@angular/router/src/url_handling_strategy';
import * as import56 from '@angular/router/src/router';
import * as import57 from '@angular/core/src/console';
import * as import58 from '@angular/core/src/i18n/tokens';
import * as import59 from '@angular/router/src/router_config_loader';
import * as import60 from '@angular/core/src/error_handler';
import * as import61 from '@angular/platform-browser/src/dom/dom_tokens';
import * as import62 from '@angular/platform-browser/src/dom/animation_driver';
import * as import63 from '@angular/core/src/render/api';
import * as import64 from '@angular/core/src/security';
import * as import65 from '@angular/core/src/change_detection/differs/iterable_differs';
import * as import66 from '@angular/core/src/change_detection/differs/keyvalue_differs';
import * as import67 from '@angular/http/src/interfaces';
import * as import68 from '@angular/http/src/http';
import * as import69 from '@angular/core/src/linker/ng_module_factory_loader';
import * as import70 from '@angular/router/src/router_state';
var AppModuleInjector = (function (_super) {
    __extends(AppModuleInjector, _super);
    function AppModuleInjector(parent) {
        _super.call(this, parent, [
            import41.AuthLoginComponentNgFactory,
            import42.ConfigurationBaseComponentNgFactory,
            import43.WizardBaseComponentNgFactory,
            import44.AppComponentNgFactory
        ], [import44.AppComponentNgFactory]);
    }
    Object.defineProperty(AppModuleInjector.prototype, "_LOCALE_ID_14", {
        get: function () {
            if ((this.__LOCALE_ID_14 == null)) {
                (this.__LOCALE_ID_14 = 'en-US');
            }
            return this.__LOCALE_ID_14;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_NgLocalization_15", {
        get: function () {
            if ((this.__NgLocalization_15 == null)) {
                (this.__NgLocalization_15 = new import13.NgLocaleLocalization(this._LOCALE_ID_14));
            }
            return this.__NgLocalization_15;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RadioControlRegistry_16", {
        get: function () {
            if ((this.__RadioControlRegistry_16 == null)) {
                (this.__RadioControlRegistry_16 = new import14.RadioControlRegistry());
            }
            return this.__RadioControlRegistry_16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTES_17", {
        get: function () {
            if ((this.__ROUTES_17 == null)) {
                (this.__ROUTES_17 = [
                    [{
                            children: [{
                                    component: import45.AuthLoginComponent,
                                    path: 'login'
                                }
                            ],
                            path: 'auth'
                        }
                    ],
                    [{
                            path: 'configuration',
                            component: import46.ConfigurationBaseComponent
                        }
                    ],
                    [
                        {
                            path: '',
                            redirectTo: '/wizard',
                            pathMatch: 'full'
                        },
                        {
                            path: 'wizard',
                            component: import47.WizardBaseComponent,
                            canActivate: [import39.WizardGuard]
                        }
                    ],
                    []
                ]);
            }
            return this.__ROUTES_17;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ApplicationRef_22", {
        get: function () {
            if ((this.__ApplicationRef_22 == null)) {
                (this.__ApplicationRef_22 = this._ApplicationRef__21);
            }
            return this.__ApplicationRef_22;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Compiler_23", {
        get: function () {
            if ((this.__Compiler_23 == null)) {
                (this.__Compiler_23 = new import18.Compiler());
            }
            return this.__Compiler_23;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_APP_ID_24", {
        get: function () {
            if ((this.__APP_ID_24 == null)) {
                (this.__APP_ID_24 = import48._appIdRandomProviderFactory());
            }
            return this.__APP_ID_24;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DOCUMENT_25", {
        get: function () {
            if ((this.__DOCUMENT_25 == null)) {
                (this.__DOCUMENT_25 = import8._document());
            }
            return this.__DOCUMENT_25;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_HAMMER_GESTURE_CONFIG_26", {
        get: function () {
            if ((this.__HAMMER_GESTURE_CONFIG_26 == null)) {
                (this.__HAMMER_GESTURE_CONFIG_26 = new import19.HammerGestureConfig());
            }
            return this.__HAMMER_GESTURE_CONFIG_26;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EVENT_MANAGER_PLUGINS_27", {
        get: function () {
            if ((this.__EVENT_MANAGER_PLUGINS_27 == null)) {
                (this.__EVENT_MANAGER_PLUGINS_27 = [
                    new import49.DomEventsPlugin(),
                    new import50.KeyEventsPlugin(),
                    new import19.HammerGesturesPlugin(this._HAMMER_GESTURE_CONFIG_26)
                ]);
            }
            return this.__EVENT_MANAGER_PLUGINS_27;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EventManager_28", {
        get: function () {
            if ((this.__EventManager_28 == null)) {
                (this.__EventManager_28 = new import20.EventManager(this._EVENT_MANAGER_PLUGINS_27, this.parent.get(import51.NgZone)));
            }
            return this.__EventManager_28;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomSharedStylesHost_29", {
        get: function () {
            if ((this.__DomSharedStylesHost_29 == null)) {
                (this.__DomSharedStylesHost_29 = new import21.DomSharedStylesHost(this._DOCUMENT_25));
            }
            return this.__DomSharedStylesHost_29;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_AnimationDriver_30", {
        get: function () {
            if ((this.__AnimationDriver_30 == null)) {
                (this.__AnimationDriver_30 = import8._resolveDefaultAnimationDriver());
            }
            return this.__AnimationDriver_30;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomRootRenderer_31", {
        get: function () {
            if ((this.__DomRootRenderer_31 == null)) {
                (this.__DomRootRenderer_31 = new import22.DomRootRenderer_(this._DOCUMENT_25, this._EventManager_28, this._DomSharedStylesHost_29, this._AnimationDriver_30, this._APP_ID_24));
            }
            return this.__DomRootRenderer_31;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RootRenderer_32", {
        get: function () {
            if ((this.__RootRenderer_32 == null)) {
                (this.__RootRenderer_32 = import52._createConditionalRootRenderer(this._DomRootRenderer_31, this.parent.get(import52.NgProbeToken, null)));
            }
            return this.__RootRenderer_32;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomSanitizer_33", {
        get: function () {
            if ((this.__DomSanitizer_33 == null)) {
                (this.__DomSanitizer_33 = new import23.DomSanitizerImpl());
            }
            return this.__DomSanitizer_33;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Sanitizer_34", {
        get: function () {
            if ((this.__Sanitizer_34 == null)) {
                (this.__Sanitizer_34 = this._DomSanitizer_33);
            }
            return this.__Sanitizer_34;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ViewUtils_35", {
        get: function () {
            if ((this.__ViewUtils_35 == null)) {
                (this.__ViewUtils_35 = new import24.ViewUtils(this._RootRenderer_32, this._Sanitizer_34));
            }
            return this.__ViewUtils_35;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_IterableDiffers_36", {
        get: function () {
            if ((this.__IterableDiffers_36 == null)) {
                (this.__IterableDiffers_36 = import7._iterableDiffersFactory());
            }
            return this.__IterableDiffers_36;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_KeyValueDiffers_37", {
        get: function () {
            if ((this.__KeyValueDiffers_37 == null)) {
                (this.__KeyValueDiffers_37 = import7._keyValueDiffersFactory());
            }
            return this.__KeyValueDiffers_37;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_SharedStylesHost_38", {
        get: function () {
            if ((this.__SharedStylesHost_38 == null)) {
                (this.__SharedStylesHost_38 = this._DomSharedStylesHost_29);
            }
            return this.__SharedStylesHost_38;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Title_39", {
        get: function () {
            if ((this.__Title_39 == null)) {
                (this.__Title_39 = new import25.Title());
            }
            return this.__Title_39;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ConfigService_40", {
        get: function () {
            if ((this.__ConfigService_40 == null)) {
                (this.__ConfigService_40 = new import26.ConfigService());
            }
            return this.__ConfigService_40;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_BrowserXhr_41", {
        get: function () {
            if ((this.__BrowserXhr_41 == null)) {
                (this.__BrowserXhr_41 = new import27.BrowserXhr());
            }
            return this.__BrowserXhr_41;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ResponseOptions_42", {
        get: function () {
            if ((this.__ResponseOptions_42 == null)) {
                (this.__ResponseOptions_42 = new import28.BaseResponseOptions());
            }
            return this.__ResponseOptions_42;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XSRFStrategy_43", {
        get: function () {
            if ((this.__XSRFStrategy_43 == null)) {
                (this.__XSRFStrategy_43 = import11._createDefaultCookieXSRFStrategy());
            }
            return this.__XSRFStrategy_43;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XHRBackend_44", {
        get: function () {
            if ((this.__XHRBackend_44 == null)) {
                (this.__XHRBackend_44 = new import29.XHRBackend(this._BrowserXhr_41, this._ResponseOptions_42, this._XSRFStrategy_43));
            }
            return this.__XHRBackend_44;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RequestOptions_45", {
        get: function () {
            if ((this.__RequestOptions_45 == null)) {
                (this.__RequestOptions_45 = new import30.BaseRequestOptions());
            }
            return this.__RequestOptions_45;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Http_46", {
        get: function () {
            if ((this.__Http_46 == null)) {
                (this.__Http_46 = import11.httpFactory(this._XHRBackend_44, this._RequestOptions_45));
            }
            return this.__Http_46;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_BrowserJsonp_47", {
        get: function () {
            if ((this.__BrowserJsonp_47 == null)) {
                (this.__BrowserJsonp_47 = new import31.BrowserJsonp());
            }
            return this.__BrowserJsonp_47;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_JSONPBackend_48", {
        get: function () {
            if ((this.__JSONPBackend_48 == null)) {
                (this.__JSONPBackend_48 = new import32.JSONPBackend_(this._BrowserJsonp_47, this._ResponseOptions_42));
            }
            return this.__JSONPBackend_48;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Jsonp_49", {
        get: function () {
            if ((this.__Jsonp_49 == null)) {
                (this.__Jsonp_49 = import11.jsonpFactory(this._JSONPBackend_48, this._RequestOptions_45));
            }
            return this.__Jsonp_49;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTER_CONFIGURATION_50", {
        get: function () {
            if ((this.__ROUTER_CONFIGURATION_50 == null)) {
                (this.__ROUTER_CONFIGURATION_50 = {});
            }
            return this.__ROUTER_CONFIGURATION_50;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_LocationStrategy_51", {
        get: function () {
            if ((this.__LocationStrategy_51 == null)) {
                (this.__LocationStrategy_51 = import2.provideLocationStrategy(this.parent.get(import53.PlatformLocation), this.parent.get(import54.APP_BASE_HREF, null), this._ROUTER_CONFIGURATION_50));
            }
            return this.__LocationStrategy_51;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Location_52", {
        get: function () {
            if ((this.__Location_52 == null)) {
                (this.__Location_52 = new import33.Location(this._LocationStrategy_51));
            }
            return this.__Location_52;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_UrlSerializer_53", {
        get: function () {
            if ((this.__UrlSerializer_53 == null)) {
                (this.__UrlSerializer_53 = new import34.DefaultUrlSerializer());
            }
            return this.__UrlSerializer_53;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RouterOutletMap_54", {
        get: function () {
            if ((this.__RouterOutletMap_54 == null)) {
                (this.__RouterOutletMap_54 = new import35.RouterOutletMap());
            }
            return this.__RouterOutletMap_54;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_NgModuleFactoryLoader_55", {
        get: function () {
            if ((this.__NgModuleFactoryLoader_55 == null)) {
                (this.__NgModuleFactoryLoader_55 = new import36.SystemJsNgModuleLoader(this._Compiler_23, this.parent.get(import36.SystemJsNgModuleLoaderConfig, null)));
            }
            return this.__NgModuleFactoryLoader_55;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Router_56", {
        get: function () {
            if ((this.__Router_56 == null)) {
                (this.__Router_56 = import2.setupRouter(this._ApplicationRef_22, this._UrlSerializer_53, this._RouterOutletMap_54, this._Location_52, this, this._NgModuleFactoryLoader_55, this._Compiler_23, this._ROUTES_17, this._ROUTER_CONFIGURATION_50, this.parent.get(import55.UrlHandlingStrategy, null)));
            }
            return this.__Router_56;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ActivatedRoute_57", {
        get: function () {
            if ((this.__ActivatedRoute_57 == null)) {
                (this.__ActivatedRoute_57 = import2.rootRoute(this._Router_56));
            }
            return this.__ActivatedRoute_57;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_PreloadAllModules_61", {
        get: function () {
            if ((this.__PreloadAllModules_61 == null)) {
                (this.__PreloadAllModules_61 = new import37.PreloadAllModules());
            }
            return this.__PreloadAllModules_61;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTER_INITIALIZER_62", {
        get: function () {
            if ((this.__ROUTER_INITIALIZER_62 == null)) {
                (this.__ROUTER_INITIALIZER_62 = import2.initialRouterNavigation(this._Router_56, this._ApplicationRef_22, this._RouterPreloader_60, this._ROUTER_CONFIGURATION_50));
            }
            return this.__ROUTER_INITIALIZER_62;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_APP_BOOTSTRAP_LISTENER_63", {
        get: function () {
            if ((this.__APP_BOOTSTRAP_LISTENER_63 == null)) {
                (this.__APP_BOOTSTRAP_LISTENER_63 = [this._ROUTER_INITIALIZER_62]);
            }
            return this.__APP_BOOTSTRAP_LISTENER_63;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DavisService_64", {
        get: function () {
            if ((this.__DavisService_64 == null)) {
                (this.__DavisService_64 = new import38.DavisService(this._Http_46));
            }
            return this.__DavisService_64;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_WizardGuard_65", {
        get: function () {
            if ((this.__WizardGuard_65 == null)) {
                (this.__WizardGuard_65 = new import39.WizardGuard(this._DavisService_64, this._Router_56));
            }
            return this.__WizardGuard_65;
        },
        enumerable: true,
        configurable: true
    });
    AppModuleInjector.prototype.createInternal = function () {
        this._ROUTER_FORROOT_GUARD_0 = import2.provideForRootGuard(this.parent.get(import56.Router, null));
        this._RouterModule_1 = new import2.RouterModule(this._ROUTER_FORROOT_GUARD_0);
        this._CommonModule_2 = new import3.CommonModule();
        this._InternalFormsSharedModule_3 = new import4.InternalFormsSharedModule();
        this._FormsModule_4 = new import5.FormsModule();
        this._AuthModule_5 = new import6.AuthModule();
        this._ApplicationModule_6 = new import7.ApplicationModule();
        this._BrowserModule_7 = new import8.BrowserModule(this.parent.get(import8.BrowserModule, null));
        this._ConfigModule_8 = new import9.ConfigModule();
        this._ConfigurationModule_9 = new import10.ConfigurationModule();
        this._HttpModule_10 = new import11.HttpModule();
        this._JsonpModule_11 = new import11.JsonpModule();
        this._WizardModule_12 = new import12.WizardModule();
        this._AppModule_13 = new import1.AppModule();
        this._ErrorHandler_18 = import8.errorHandler();
        this._ApplicationInitStatus_19 = new import15.ApplicationInitStatus(this.parent.get(import15.APP_INITIALIZER, null));
        this._Testability_20 = new import16.Testability(this.parent.get(import51.NgZone));
        this._ApplicationRef__21 = new import17.ApplicationRef_(this.parent.get(import51.NgZone), this.parent.get(import57.Console), this, this._ErrorHandler_18, this, this._ApplicationInitStatus_19, this.parent.get(import16.TestabilityRegistry, null), this._Testability_20);
        this._NoPreloading_58 = new import37.NoPreloading();
        this._PreloadingStrategy_59 = this._NoPreloading_58;
        this._RouterPreloader_60 = new import37.RouterPreloader(this._Router_56, this._NgModuleFactoryLoader_55, this._Compiler_23, this, this._PreloadingStrategy_59);
        return this._AppModule_13;
    };
    AppModuleInjector.prototype.getInternal = function (token, notFoundResult) {
        if ((token === import2.ROUTER_FORROOT_GUARD)) {
            return this._ROUTER_FORROOT_GUARD_0;
        }
        if ((token === import2.RouterModule)) {
            return this._RouterModule_1;
        }
        if ((token === import3.CommonModule)) {
            return this._CommonModule_2;
        }
        if ((token === import4.InternalFormsSharedModule)) {
            return this._InternalFormsSharedModule_3;
        }
        if ((token === import5.FormsModule)) {
            return this._FormsModule_4;
        }
        if ((token === import6.AuthModule)) {
            return this._AuthModule_5;
        }
        if ((token === import7.ApplicationModule)) {
            return this._ApplicationModule_6;
        }
        if ((token === import8.BrowserModule)) {
            return this._BrowserModule_7;
        }
        if ((token === import9.ConfigModule)) {
            return this._ConfigModule_8;
        }
        if ((token === import10.ConfigurationModule)) {
            return this._ConfigurationModule_9;
        }
        if ((token === import11.HttpModule)) {
            return this._HttpModule_10;
        }
        if ((token === import11.JsonpModule)) {
            return this._JsonpModule_11;
        }
        if ((token === import12.WizardModule)) {
            return this._WizardModule_12;
        }
        if ((token === import1.AppModule)) {
            return this._AppModule_13;
        }
        if ((token === import58.LOCALE_ID)) {
            return this._LOCALE_ID_14;
        }
        if ((token === import13.NgLocalization)) {
            return this._NgLocalization_15;
        }
        if ((token === import14.RadioControlRegistry)) {
            return this._RadioControlRegistry_16;
        }
        if ((token === import59.ROUTES)) {
            return this._ROUTES_17;
        }
        if ((token === import60.ErrorHandler)) {
            return this._ErrorHandler_18;
        }
        if ((token === import15.ApplicationInitStatus)) {
            return this._ApplicationInitStatus_19;
        }
        if ((token === import16.Testability)) {
            return this._Testability_20;
        }
        if ((token === import17.ApplicationRef_)) {
            return this._ApplicationRef__21;
        }
        if ((token === import17.ApplicationRef)) {
            return this._ApplicationRef_22;
        }
        if ((token === import18.Compiler)) {
            return this._Compiler_23;
        }
        if ((token === import48.APP_ID)) {
            return this._APP_ID_24;
        }
        if ((token === import61.DOCUMENT)) {
            return this._DOCUMENT_25;
        }
        if ((token === import19.HAMMER_GESTURE_CONFIG)) {
            return this._HAMMER_GESTURE_CONFIG_26;
        }
        if ((token === import20.EVENT_MANAGER_PLUGINS)) {
            return this._EVENT_MANAGER_PLUGINS_27;
        }
        if ((token === import20.EventManager)) {
            return this._EventManager_28;
        }
        if ((token === import21.DomSharedStylesHost)) {
            return this._DomSharedStylesHost_29;
        }
        if ((token === import62.AnimationDriver)) {
            return this._AnimationDriver_30;
        }
        if ((token === import22.DomRootRenderer)) {
            return this._DomRootRenderer_31;
        }
        if ((token === import63.RootRenderer)) {
            return this._RootRenderer_32;
        }
        if ((token === import23.DomSanitizer)) {
            return this._DomSanitizer_33;
        }
        if ((token === import64.Sanitizer)) {
            return this._Sanitizer_34;
        }
        if ((token === import24.ViewUtils)) {
            return this._ViewUtils_35;
        }
        if ((token === import65.IterableDiffers)) {
            return this._IterableDiffers_36;
        }
        if ((token === import66.KeyValueDiffers)) {
            return this._KeyValueDiffers_37;
        }
        if ((token === import21.SharedStylesHost)) {
            return this._SharedStylesHost_38;
        }
        if ((token === import25.Title)) {
            return this._Title_39;
        }
        if ((token === import26.ConfigService)) {
            return this._ConfigService_40;
        }
        if ((token === import27.BrowserXhr)) {
            return this._BrowserXhr_41;
        }
        if ((token === import28.ResponseOptions)) {
            return this._ResponseOptions_42;
        }
        if ((token === import67.XSRFStrategy)) {
            return this._XSRFStrategy_43;
        }
        if ((token === import29.XHRBackend)) {
            return this._XHRBackend_44;
        }
        if ((token === import30.RequestOptions)) {
            return this._RequestOptions_45;
        }
        if ((token === import68.Http)) {
            return this._Http_46;
        }
        if ((token === import31.BrowserJsonp)) {
            return this._BrowserJsonp_47;
        }
        if ((token === import32.JSONPBackend)) {
            return this._JSONPBackend_48;
        }
        if ((token === import68.Jsonp)) {
            return this._Jsonp_49;
        }
        if ((token === import2.ROUTER_CONFIGURATION)) {
            return this._ROUTER_CONFIGURATION_50;
        }
        if ((token === import54.LocationStrategy)) {
            return this._LocationStrategy_51;
        }
        if ((token === import33.Location)) {
            return this._Location_52;
        }
        if ((token === import34.UrlSerializer)) {
            return this._UrlSerializer_53;
        }
        if ((token === import35.RouterOutletMap)) {
            return this._RouterOutletMap_54;
        }
        if ((token === import69.NgModuleFactoryLoader)) {
            return this._NgModuleFactoryLoader_55;
        }
        if ((token === import56.Router)) {
            return this._Router_56;
        }
        if ((token === import70.ActivatedRoute)) {
            return this._ActivatedRoute_57;
        }
        if ((token === import37.NoPreloading)) {
            return this._NoPreloading_58;
        }
        if ((token === import37.PreloadingStrategy)) {
            return this._PreloadingStrategy_59;
        }
        if ((token === import37.RouterPreloader)) {
            return this._RouterPreloader_60;
        }
        if ((token === import37.PreloadAllModules)) {
            return this._PreloadAllModules_61;
        }
        if ((token === import2.ROUTER_INITIALIZER)) {
            return this._ROUTER_INITIALIZER_62;
        }
        if ((token === import48.APP_BOOTSTRAP_LISTENER)) {
            return this._APP_BOOTSTRAP_LISTENER_63;
        }
        if ((token === import38.DavisService)) {
            return this._DavisService_64;
        }
        if ((token === import39.WizardGuard)) {
            return this._WizardGuard_65;
        }
        return notFoundResult;
    };
    AppModuleInjector.prototype.destroyInternal = function () {
        this._ApplicationRef__21.ngOnDestroy();
        this._RouterPreloader_60.ngOnDestroy();
    };
    return AppModuleInjector;
}(import0.NgModuleInjector));
export var AppModuleNgFactory = new import0.NgModuleFactory(AppModuleInjector, import1.AppModule);
//# sourceMappingURL=app.module.ngfactory.js.map