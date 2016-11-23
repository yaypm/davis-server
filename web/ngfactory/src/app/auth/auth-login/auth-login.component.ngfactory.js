var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/auth/auth-login/auth-login.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '@angular/router/src/router';
export var Wrapper_AuthLoginComponent = (function () {
    function Wrapper_AuthLoginComponent(p0) {
        this._changed = false;
        this.context = new import0.AuthLoginComponent(p0);
    }
    Wrapper_AuthLoginComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_AuthLoginComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_AuthLoginComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_AuthLoginComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_AuthLoginComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_AuthLoginComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_AuthLoginComponent;
}());
var renderType_AuthLoginComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_AuthLoginComponent_Host0 = (function (_super) {
    __extends(View_AuthLoginComponent_Host0, _super);
    function View_AuthLoginComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AuthLoginComponent_Host0, renderType_AuthLoginComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_AuthLoginComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'auth-login', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_AuthLoginComponent0(this.viewUtils, this, 0, this._el_0);
        this._AuthLoginComponent_0_3 = new Wrapper_AuthLoginComponent(this.injectorGet(import8.Router, this.parentIndex));
        this.compView_0.create(this._AuthLoginComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._AuthLoginComponent_0_3.context);
    };
    View_AuthLoginComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.AuthLoginComponent) && (0 === requestNodeIndex))) {
            return this._AuthLoginComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_AuthLoginComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._AuthLoginComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_AuthLoginComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_AuthLoginComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_AuthLoginComponent_Host0;
}(import1.AppView));
export var AuthLoginComponentNgFactory = new import7.ComponentFactory('auth-login', View_AuthLoginComponent_Host0, import0.AuthLoginComponent);
var styles_AuthLoginComponent = [];
var renderType_AuthLoginComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, styles_AuthLoginComponent, {});
export var View_AuthLoginComponent0 = (function (_super) {
    __extends(View_AuthLoginComponent0, _super);
    function View_AuthLoginComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AuthLoginComponent0, renderType_AuthLoginComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_AuthLoginComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this.init(null, (this.renderer.directRenderer ? null : []), null);
        return null;
    };
    return View_AuthLoginComponent0;
}(import1.AppView));
//# sourceMappingURL=auth-login.component.ngfactory.js.map