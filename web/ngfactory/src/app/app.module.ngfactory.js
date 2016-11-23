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
import * as import9 from '../../../src/app/config/config.module';
import * as import10 from '@angular/http/src/http_module';
import * as import11 from '../../../src/app/wizard/wizard.module';
import * as import12 from '@angular/common/src/localization';
import * as import13 from '@angular/forms/src/directives/radio_control_value_accessor';
import * as import14 from '@angular/core/src/application_init';
import * as import15 from '@angular/core/src/testability/testability';
import * as import16 from '@angular/core/src/application_ref';
import * as import17 from '@angular/core/src/linker/compiler';
import * as import18 from '@angular/platform-browser/src/dom/events/hammer_gestures';
import * as import19 from '@angular/platform-browser/src/dom/events/event_manager';
import * as import20 from '@angular/platform-browser/src/dom/shared_styles_host';
import * as import21 from '@angular/platform-browser/src/dom/dom_renderer';
import * as import22 from '@angular/platform-browser/src/security/dom_sanitization_service';
import * as import23 from '@angular/core/src/linker/view_utils';
import * as import24 from '@angular/platform-browser/src/browser/title';
import * as import25 from '@angular/http/src/backends/browser_xhr';
import * as import26 from '@angular/http/src/base_response_options';
import * as import27 from '@angular/http/src/backends/xhr_backend';
import * as import28 from '@angular/http/src/base_request_options';
import * as import29 from '@angular/http/src/backends/browser_jsonp';
import * as import30 from '@angular/http/src/backends/jsonp_backend';
import * as import31 from '@angular/common/src/location/location';
import * as import32 from '@angular/router/src/url_tree';
import * as import33 from '@angular/router/src/router_outlet_map';
import * as import34 from '@angular/core/src/linker/system_js_ng_module_factory_loader';
import * as import35 from '@angular/router/src/router_preloader';
import * as import36 from '../../../src/app/shared/config.service';
import * as import38 from './auth/auth-login/auth-login.component.ngfactory';
import * as import39 from './config/config-base/config-base.component.ngfactory';
import * as import40 from './wizard/wizard-base/wizard.component.ngfactory';
import * as import41 from './app.component.ngfactory';
import * as import42 from '../../../src/app/auth/auth-login/auth-login.component';
import * as import43 from '../../../src/app/config/config-base/config-base.component';
import * as import44 from '../../../src/app/wizard/wizard-base/wizard.component';
import * as import45 from '@angular/core/src/application_tokens';
import * as import46 from '@angular/platform-browser/src/dom/events/dom_events';
import * as import47 from '@angular/platform-browser/src/dom/events/key_events';
import * as import48 from '@angular/core/src/zone/ng_zone';
import * as import49 from '@angular/platform-browser/src/dom/debug/ng_probe';
import * as import50 from '@angular/common/src/location/platform_location';
import * as import51 from '@angular/common/src/location/location_strategy';
import * as import52 from '@angular/router/src/url_handling_strategy';
import * as import53 from '@angular/router/src/router';
import * as import54 from '@angular/core/src/console';
import * as import55 from '@angular/core/src/i18n/tokens';
import * as import56 from '@angular/router/src/router_config_loader';
import * as import57 from '@angular/core/src/error_handler';
import * as import58 from '@angular/platform-browser/src/dom/dom_tokens';
import * as import59 from '@angular/platform-browser/src/dom/animation_driver';
import * as import60 from '@angular/core/src/render/api';
import * as import61 from '@angular/core/src/security';
import * as import62 from '@angular/core/src/change_detection/differs/iterable_differs';
import * as import63 from '@angular/core/src/change_detection/differs/keyvalue_differs';
import * as import64 from '@angular/http/src/interfaces';
import * as import65 from '@angular/http/src/http';
import * as import66 from '@angular/core/src/linker/ng_module_factory_loader';
import * as import67 from '@angular/router/src/router_state';
var AppModuleInjector = (function (_super) {
    __extends(AppModuleInjector, _super);
    function AppModuleInjector(parent) {
        _super.call(this, parent, [
            import38.AuthLoginComponentNgFactory,
            import39.ConfigBaseComponentNgFactory,
            import40.WizardComponentNgFactory,
            import41.AppComponentNgFactory
        ], [import41.AppComponentNgFactory]);
    }
    Object.defineProperty(AppModuleInjector.prototype, "_LOCALE_ID_13", {
        get: function () {
            if ((this.__LOCALE_ID_13 == null)) {
                (this.__LOCALE_ID_13 = 'en-US');
            }
            return this.__LOCALE_ID_13;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_NgLocalization_14", {
        get: function () {
            if ((this.__NgLocalization_14 == null)) {
                (this.__NgLocalization_14 = new import12.NgLocaleLocalization(this._LOCALE_ID_13));
            }
            return this.__NgLocalization_14;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RadioControlRegistry_15", {
        get: function () {
            if ((this.__RadioControlRegistry_15 == null)) {
                (this.__RadioControlRegistry_15 = new import13.RadioControlRegistry());
            }
            return this.__RadioControlRegistry_15;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTES_16", {
        get: function () {
            if ((this.__ROUTES_16 == null)) {
                (this.__ROUTES_16 = [
                    [{
                            children: [{
                                    component: import42.AuthLoginComponent,
                                    path: 'login'
                                }
                            ],
                            path: 'auth'
                        }
                    ],
                    [{
                            path: 'config',
                            component: import43.ConfigBaseComponent
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
                            component: import44.WizardComponent
                        }
                    ],
                    []
                ]);
            }
            return this.__ROUTES_16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ApplicationRef_21", {
        get: function () {
            if ((this.__ApplicationRef_21 == null)) {
                (this.__ApplicationRef_21 = this._ApplicationRef__20);
            }
            return this.__ApplicationRef_21;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Compiler_22", {
        get: function () {
            if ((this.__Compiler_22 == null)) {
                (this.__Compiler_22 = new import17.Compiler());
            }
            return this.__Compiler_22;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_APP_ID_23", {
        get: function () {
            if ((this.__APP_ID_23 == null)) {
                (this.__APP_ID_23 = import45._appIdRandomProviderFactory());
            }
            return this.__APP_ID_23;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DOCUMENT_24", {
        get: function () {
            if ((this.__DOCUMENT_24 == null)) {
                (this.__DOCUMENT_24 = import8._document());
            }
            return this.__DOCUMENT_24;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_HAMMER_GESTURE_CONFIG_25", {
        get: function () {
            if ((this.__HAMMER_GESTURE_CONFIG_25 == null)) {
                (this.__HAMMER_GESTURE_CONFIG_25 = new import18.HammerGestureConfig());
            }
            return this.__HAMMER_GESTURE_CONFIG_25;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EVENT_MANAGER_PLUGINS_26", {
        get: function () {
            if ((this.__EVENT_MANAGER_PLUGINS_26 == null)) {
                (this.__EVENT_MANAGER_PLUGINS_26 = [
                    new import46.DomEventsPlugin(),
                    new import47.KeyEventsPlugin(),
                    new import18.HammerGesturesPlugin(this._HAMMER_GESTURE_CONFIG_25)
                ]);
            }
            return this.__EVENT_MANAGER_PLUGINS_26;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_EventManager_27", {
        get: function () {
            if ((this.__EventManager_27 == null)) {
                (this.__EventManager_27 = new import19.EventManager(this._EVENT_MANAGER_PLUGINS_26, this.parent.get(import48.NgZone)));
            }
            return this.__EventManager_27;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomSharedStylesHost_28", {
        get: function () {
            if ((this.__DomSharedStylesHost_28 == null)) {
                (this.__DomSharedStylesHost_28 = new import20.DomSharedStylesHost(this._DOCUMENT_24));
            }
            return this.__DomSharedStylesHost_28;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_AnimationDriver_29", {
        get: function () {
            if ((this.__AnimationDriver_29 == null)) {
                (this.__AnimationDriver_29 = import8._resolveDefaultAnimationDriver());
            }
            return this.__AnimationDriver_29;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomRootRenderer_30", {
        get: function () {
            if ((this.__DomRootRenderer_30 == null)) {
                (this.__DomRootRenderer_30 = new import21.DomRootRenderer_(this._DOCUMENT_24, this._EventManager_27, this._DomSharedStylesHost_28, this._AnimationDriver_29, this._APP_ID_23));
            }
            return this.__DomRootRenderer_30;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RootRenderer_31", {
        get: function () {
            if ((this.__RootRenderer_31 == null)) {
                (this.__RootRenderer_31 = import49._createConditionalRootRenderer(this._DomRootRenderer_30, this.parent.get(import49.NgProbeToken, null)));
            }
            return this.__RootRenderer_31;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_DomSanitizer_32", {
        get: function () {
            if ((this.__DomSanitizer_32 == null)) {
                (this.__DomSanitizer_32 = new import22.DomSanitizerImpl());
            }
            return this.__DomSanitizer_32;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Sanitizer_33", {
        get: function () {
            if ((this.__Sanitizer_33 == null)) {
                (this.__Sanitizer_33 = this._DomSanitizer_32);
            }
            return this.__Sanitizer_33;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ViewUtils_34", {
        get: function () {
            if ((this.__ViewUtils_34 == null)) {
                (this.__ViewUtils_34 = new import23.ViewUtils(this._RootRenderer_31, this._Sanitizer_33));
            }
            return this.__ViewUtils_34;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_IterableDiffers_35", {
        get: function () {
            if ((this.__IterableDiffers_35 == null)) {
                (this.__IterableDiffers_35 = import7._iterableDiffersFactory());
            }
            return this.__IterableDiffers_35;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_KeyValueDiffers_36", {
        get: function () {
            if ((this.__KeyValueDiffers_36 == null)) {
                (this.__KeyValueDiffers_36 = import7._keyValueDiffersFactory());
            }
            return this.__KeyValueDiffers_36;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_SharedStylesHost_37", {
        get: function () {
            if ((this.__SharedStylesHost_37 == null)) {
                (this.__SharedStylesHost_37 = this._DomSharedStylesHost_28);
            }
            return this.__SharedStylesHost_37;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Title_38", {
        get: function () {
            if ((this.__Title_38 == null)) {
                (this.__Title_38 = new import24.Title());
            }
            return this.__Title_38;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_BrowserXhr_39", {
        get: function () {
            if ((this.__BrowserXhr_39 == null)) {
                (this.__BrowserXhr_39 = new import25.BrowserXhr());
            }
            return this.__BrowserXhr_39;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ResponseOptions_40", {
        get: function () {
            if ((this.__ResponseOptions_40 == null)) {
                (this.__ResponseOptions_40 = new import26.BaseResponseOptions());
            }
            return this.__ResponseOptions_40;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XSRFStrategy_41", {
        get: function () {
            if ((this.__XSRFStrategy_41 == null)) {
                (this.__XSRFStrategy_41 = import10._createDefaultCookieXSRFStrategy());
            }
            return this.__XSRFStrategy_41;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_XHRBackend_42", {
        get: function () {
            if ((this.__XHRBackend_42 == null)) {
                (this.__XHRBackend_42 = new import27.XHRBackend(this._BrowserXhr_39, this._ResponseOptions_40, this._XSRFStrategy_41));
            }
            return this.__XHRBackend_42;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RequestOptions_43", {
        get: function () {
            if ((this.__RequestOptions_43 == null)) {
                (this.__RequestOptions_43 = new import28.BaseRequestOptions());
            }
            return this.__RequestOptions_43;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Http_44", {
        get: function () {
            if ((this.__Http_44 == null)) {
                (this.__Http_44 = import10.httpFactory(this._XHRBackend_42, this._RequestOptions_43));
            }
            return this.__Http_44;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_BrowserJsonp_45", {
        get: function () {
            if ((this.__BrowserJsonp_45 == null)) {
                (this.__BrowserJsonp_45 = new import29.BrowserJsonp());
            }
            return this.__BrowserJsonp_45;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_JSONPBackend_46", {
        get: function () {
            if ((this.__JSONPBackend_46 == null)) {
                (this.__JSONPBackend_46 = new import30.JSONPBackend_(this._BrowserJsonp_45, this._ResponseOptions_40));
            }
            return this.__JSONPBackend_46;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Jsonp_47", {
        get: function () {
            if ((this.__Jsonp_47 == null)) {
                (this.__Jsonp_47 = import10.jsonpFactory(this._JSONPBackend_46, this._RequestOptions_43));
            }
            return this.__Jsonp_47;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTER_CONFIGURATION_48", {
        get: function () {
            if ((this.__ROUTER_CONFIGURATION_48 == null)) {
                (this.__ROUTER_CONFIGURATION_48 = {});
            }
            return this.__ROUTER_CONFIGURATION_48;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_LocationStrategy_49", {
        get: function () {
            if ((this.__LocationStrategy_49 == null)) {
                (this.__LocationStrategy_49 = import2.provideLocationStrategy(this.parent.get(import50.PlatformLocation), this.parent.get(import51.APP_BASE_HREF, null), this._ROUTER_CONFIGURATION_48));
            }
            return this.__LocationStrategy_49;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Location_50", {
        get: function () {
            if ((this.__Location_50 == null)) {
                (this.__Location_50 = new import31.Location(this._LocationStrategy_49));
            }
            return this.__Location_50;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_UrlSerializer_51", {
        get: function () {
            if ((this.__UrlSerializer_51 == null)) {
                (this.__UrlSerializer_51 = new import32.DefaultUrlSerializer());
            }
            return this.__UrlSerializer_51;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_RouterOutletMap_52", {
        get: function () {
            if ((this.__RouterOutletMap_52 == null)) {
                (this.__RouterOutletMap_52 = new import33.RouterOutletMap());
            }
            return this.__RouterOutletMap_52;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_NgModuleFactoryLoader_53", {
        get: function () {
            if ((this.__NgModuleFactoryLoader_53 == null)) {
                (this.__NgModuleFactoryLoader_53 = new import34.SystemJsNgModuleLoader(this._Compiler_22, this.parent.get(import34.SystemJsNgModuleLoaderConfig, null)));
            }
            return this.__NgModuleFactoryLoader_53;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_Router_54", {
        get: function () {
            if ((this.__Router_54 == null)) {
                (this.__Router_54 = import2.setupRouter(this._ApplicationRef_21, this._UrlSerializer_51, this._RouterOutletMap_52, this._Location_50, this, this._NgModuleFactoryLoader_53, this._Compiler_22, this._ROUTES_16, this._ROUTER_CONFIGURATION_48, this.parent.get(import52.UrlHandlingStrategy, null)));
            }
            return this.__Router_54;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ActivatedRoute_55", {
        get: function () {
            if ((this.__ActivatedRoute_55 == null)) {
                (this.__ActivatedRoute_55 = import2.rootRoute(this._Router_54));
            }
            return this.__ActivatedRoute_55;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_PreloadAllModules_59", {
        get: function () {
            if ((this.__PreloadAllModules_59 == null)) {
                (this.__PreloadAllModules_59 = new import35.PreloadAllModules());
            }
            return this.__PreloadAllModules_59;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ROUTER_INITIALIZER_60", {
        get: function () {
            if ((this.__ROUTER_INITIALIZER_60 == null)) {
                (this.__ROUTER_INITIALIZER_60 = import2.initialRouterNavigation(this._Router_54, this._ApplicationRef_21, this._RouterPreloader_58, this._ROUTER_CONFIGURATION_48));
            }
            return this.__ROUTER_INITIALIZER_60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_APP_BOOTSTRAP_LISTENER_61", {
        get: function () {
            if ((this.__APP_BOOTSTRAP_LISTENER_61 == null)) {
                (this.__APP_BOOTSTRAP_LISTENER_61 = [this._ROUTER_INITIALIZER_60]);
            }
            return this.__APP_BOOTSTRAP_LISTENER_61;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModuleInjector.prototype, "_ConfigService_62", {
        get: function () {
            if ((this.__ConfigService_62 == null)) {
                (this.__ConfigService_62 = new import36.ConfigService(this._Http_44));
            }
            return this.__ConfigService_62;
        },
        enumerable: true,
        configurable: true
    });
    AppModuleInjector.prototype.createInternal = function () {
        this._ROUTER_FORROOT_GUARD_0 = import2.provideForRootGuard(this.parent.get(import53.Router, null));
        this._RouterModule_1 = new import2.RouterModule(this._ROUTER_FORROOT_GUARD_0);
        this._CommonModule_2 = new import3.CommonModule();
        this._InternalFormsSharedModule_3 = new import4.InternalFormsSharedModule();
        this._FormsModule_4 = new import5.FormsModule();
        this._AuthModule_5 = new import6.AuthModule();
        this._ApplicationModule_6 = new import7.ApplicationModule();
        this._BrowserModule_7 = new import8.BrowserModule(this.parent.get(import8.BrowserModule, null));
        this._ConfigModule_8 = new import9.ConfigModule();
        this._HttpModule_9 = new import10.HttpModule();
        this._JsonpModule_10 = new import10.JsonpModule();
        this._WizardModule_11 = new import11.WizardModule();
        this._AppModule_12 = new import1.AppModule();
        this._ErrorHandler_17 = import8.errorHandler();
        this._ApplicationInitStatus_18 = new import14.ApplicationInitStatus(this.parent.get(import14.APP_INITIALIZER, null));
        this._Testability_19 = new import15.Testability(this.parent.get(import48.NgZone));
        this._ApplicationRef__20 = new import16.ApplicationRef_(this.parent.get(import48.NgZone), this.parent.get(import54.Console), this, this._ErrorHandler_17, this, this._ApplicationInitStatus_18, this.parent.get(import15.TestabilityRegistry, null), this._Testability_19);
        this._NoPreloading_56 = new import35.NoPreloading();
        this._PreloadingStrategy_57 = this._NoPreloading_56;
        this._RouterPreloader_58 = new import35.RouterPreloader(this._Router_54, this._NgModuleFactoryLoader_53, this._Compiler_22, this, this._PreloadingStrategy_57);
        return this._AppModule_12;
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
        if ((token === import10.HttpModule)) {
            return this._HttpModule_9;
        }
        if ((token === import10.JsonpModule)) {
            return this._JsonpModule_10;
        }
        if ((token === import11.WizardModule)) {
            return this._WizardModule_11;
        }
        if ((token === import1.AppModule)) {
            return this._AppModule_12;
        }
        if ((token === import55.LOCALE_ID)) {
            return this._LOCALE_ID_13;
        }
        if ((token === import12.NgLocalization)) {
            return this._NgLocalization_14;
        }
        if ((token === import13.RadioControlRegistry)) {
            return this._RadioControlRegistry_15;
        }
        if ((token === import56.ROUTES)) {
            return this._ROUTES_16;
        }
        if ((token === import57.ErrorHandler)) {
            return this._ErrorHandler_17;
        }
        if ((token === import14.ApplicationInitStatus)) {
            return this._ApplicationInitStatus_18;
        }
        if ((token === import15.Testability)) {
            return this._Testability_19;
        }
        if ((token === import16.ApplicationRef_)) {
            return this._ApplicationRef__20;
        }
        if ((token === import16.ApplicationRef)) {
            return this._ApplicationRef_21;
        }
        if ((token === import17.Compiler)) {
            return this._Compiler_22;
        }
        if ((token === import45.APP_ID)) {
            return this._APP_ID_23;
        }
        if ((token === import58.DOCUMENT)) {
            return this._DOCUMENT_24;
        }
        if ((token === import18.HAMMER_GESTURE_CONFIG)) {
            return this._HAMMER_GESTURE_CONFIG_25;
        }
        if ((token === import19.EVENT_MANAGER_PLUGINS)) {
            return this._EVENT_MANAGER_PLUGINS_26;
        }
        if ((token === import19.EventManager)) {
            return this._EventManager_27;
        }
        if ((token === import20.DomSharedStylesHost)) {
            return this._DomSharedStylesHost_28;
        }
        if ((token === import59.AnimationDriver)) {
            return this._AnimationDriver_29;
        }
        if ((token === import21.DomRootRenderer)) {
            return this._DomRootRenderer_30;
        }
        if ((token === import60.RootRenderer)) {
            return this._RootRenderer_31;
        }
        if ((token === import22.DomSanitizer)) {
            return this._DomSanitizer_32;
        }
        if ((token === import61.Sanitizer)) {
            return this._Sanitizer_33;
        }
        if ((token === import23.ViewUtils)) {
            return this._ViewUtils_34;
        }
        if ((token === import62.IterableDiffers)) {
            return this._IterableDiffers_35;
        }
        if ((token === import63.KeyValueDiffers)) {
            return this._KeyValueDiffers_36;
        }
        if ((token === import20.SharedStylesHost)) {
            return this._SharedStylesHost_37;
        }
        if ((token === import24.Title)) {
            return this._Title_38;
        }
        if ((token === import25.BrowserXhr)) {
            return this._BrowserXhr_39;
        }
        if ((token === import26.ResponseOptions)) {
            return this._ResponseOptions_40;
        }
        if ((token === import64.XSRFStrategy)) {
            return this._XSRFStrategy_41;
        }
        if ((token === import27.XHRBackend)) {
            return this._XHRBackend_42;
        }
        if ((token === import28.RequestOptions)) {
            return this._RequestOptions_43;
        }
        if ((token === import65.Http)) {
            return this._Http_44;
        }
        if ((token === import29.BrowserJsonp)) {
            return this._BrowserJsonp_45;
        }
        if ((token === import30.JSONPBackend)) {
            return this._JSONPBackend_46;
        }
        if ((token === import65.Jsonp)) {
            return this._Jsonp_47;
        }
        if ((token === import2.ROUTER_CONFIGURATION)) {
            return this._ROUTER_CONFIGURATION_48;
        }
        if ((token === import51.LocationStrategy)) {
            return this._LocationStrategy_49;
        }
        if ((token === import31.Location)) {
            return this._Location_50;
        }
        if ((token === import32.UrlSerializer)) {
            return this._UrlSerializer_51;
        }
        if ((token === import33.RouterOutletMap)) {
            return this._RouterOutletMap_52;
        }
        if ((token === import66.NgModuleFactoryLoader)) {
            return this._NgModuleFactoryLoader_53;
        }
        if ((token === import53.Router)) {
            return this._Router_54;
        }
        if ((token === import67.ActivatedRoute)) {
            return this._ActivatedRoute_55;
        }
        if ((token === import35.NoPreloading)) {
            return this._NoPreloading_56;
        }
        if ((token === import35.PreloadingStrategy)) {
            return this._PreloadingStrategy_57;
        }
        if ((token === import35.RouterPreloader)) {
            return this._RouterPreloader_58;
        }
        if ((token === import35.PreloadAllModules)) {
            return this._PreloadAllModules_59;
        }
        if ((token === import2.ROUTER_INITIALIZER)) {
            return this._ROUTER_INITIALIZER_60;
        }
        if ((token === import45.APP_BOOTSTRAP_LISTENER)) {
            return this._APP_BOOTSTRAP_LISTENER_61;
        }
        if ((token === import36.ConfigService)) {
            return this._ConfigService_62;
        }
        return notFoundResult;
    };
    AppModuleInjector.prototype.destroyInternal = function () {
        this._ApplicationRef__20.ngOnDestroy();
        this._RouterPreloader_58.ngOnDestroy();
    };
    return AppModuleInjector;
}(import0.NgModuleInjector));
export var AppModuleNgFactory = new import0.NgModuleFactory(AppModuleInjector, import1.AppModule);
//# sourceMappingURL=app.module.ngfactory.js.map