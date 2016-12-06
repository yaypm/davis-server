var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../src/app/app.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../src/app/shared/davis.service';
import * as import9 from '@angular/router/src/router';
import * as import10 from '@angular/core/src/linker/view_container';
import * as import11 from '../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import12 from '../../node_modules/@angular/router/src/directives/router_outlet.ngfactory';
import * as import13 from '@angular/core/src/change_detection/change_detection_util';
import * as import14 from '@angular/core/src/linker/template_ref';
import * as import15 from '@angular/router/src/router_outlet_map';
import * as import16 from '@angular/core/src/linker/component_factory_resolver';
import * as import17 from '@angular/common/src/directives/ng_if';
import * as import18 from '@angular/router/src/directives/router_outlet';
export var Wrapper_AppComponent = (function () {
    function Wrapper_AppComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.AppComponent(p0, p1);
    }
    Wrapper_AppComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_AppComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_AppComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_AppComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_AppComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_AppComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_AppComponent;
}());
var renderType_AppComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_AppComponent_Host0 = (function (_super) {
    __extends(View_AppComponent_Host0, _super);
    function View_AppComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AppComponent_Host0, renderType_AppComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_AppComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'davis', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_AppComponent0(this.viewUtils, this, 0, this._el_0);
        this._AppComponent_0_3 = new Wrapper_AppComponent(this.injectorGet(import8.DavisService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._AppComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._AppComponent_0_3.context);
    };
    View_AppComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.AppComponent) && (0 === requestNodeIndex))) {
            return this._AppComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_AppComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._AppComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_AppComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_AppComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_AppComponent_Host0;
}(import1.AppView));
export var AppComponentNgFactory = new import7.ComponentFactory('davis', View_AppComponent_Host0, import0.AppComponent);
var styles_AppComponent = [];
var renderType_AppComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, styles_AppComponent, {});
export var View_AppComponent0 = (function (_super) {
    __extends(View_AppComponent0, _super);
    function View_AppComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AppComponent0, renderType_AppComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
        this._expr_19 = import13.UNINITIALIZED;
    }
    View_AppComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'a', new import3.InlineArray4(4, 'href', 'https://github.com/Dynatrace/davis-server', 'target', '_blank'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n  ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', new import3.InlineArray4(4, 'id', 'logo', 'src', '/assets/img/Dynatrace_Logo_RGB_CPH_512x92px.png'), null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        this._text_4 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_5 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'title-global'), null);
        this._text_6 = this.renderer.createText(this._el_5, '', null);
        this._text_7 = this.renderer.createText(parentRenderNode, '\n', null);
        this._anchor_8 = this.renderer.createTemplateAnchor(parentRenderNode, null);
        this._vc_8 = new import10.ViewContainer(8, null, this, this._anchor_8);
        this._TemplateRef_8_5 = new import14.TemplateRef_(this, 8, this._anchor_8);
        this._NgIf_8_6 = new import11.Wrapper_NgIf(this._vc_8.vcRef, this._TemplateRef_8_5);
        this._text_9 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_10 = import3.createRenderElement(this.renderer, parentRenderNode, 'router-outlet', import3.EMPTY_INLINE_ARRAY, null);
        this._vc_10 = new import10.ViewContainer(10, null, this, this._el_10);
        this._RouterOutlet_10_5 = new import12.Wrapper_RouterOutlet(this.parentView.injectorGet(import15.RouterOutletMap, this.parentIndex), this._vc_10.vcRef, this.parentView.injectorGet(import16.ComponentFactoryResolver, this.parentIndex), null);
        this._text_11 = this.renderer.createText(parentRenderNode, '\n', null);
        this._el_12 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'id', 'made-in-detroit'), null);
        this._text_13 = this.renderer.createText(this._el_12, 'Made in Detroit', null);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._text_7,
            this._anchor_8,
            this._text_9,
            this._el_10,
            this._text_11,
            this._el_12,
            this._text_13
        ]), null);
        return null;
    };
    View_AppComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import14.TemplateRef) && (8 === requestNodeIndex))) {
            return this._TemplateRef_8_5;
        }
        if (((token === import17.NgIf) && (8 === requestNodeIndex))) {
            return this._NgIf_8_6.context;
        }
        if (((token === import18.RouterOutlet) && (10 === requestNodeIndex))) {
            return this._RouterOutlet_10_5.context;
        }
        return notFoundResult;
    };
    View_AppComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_8_0_0 = (this.context.iDavis.isAuthenticated && !this.context.iDavis.isWizard);
        this._NgIf_8_6.check_ngIf(currVal_8_0_0, throwOnChange, false);
        this._NgIf_8_6.ngDoCheck(this, this._anchor_8, throwOnChange);
        this._RouterOutlet_10_5.ngDoCheck(this, this._el_10, throwOnChange);
        this._vc_8.detectChangesInNestedViews(throwOnChange);
        this._vc_10.detectChangesInNestedViews(throwOnChange);
        var currVal_19 = import3.inlineInterpolate(1, '\n    ', this.context.iDavis.titleGlobal, '\n');
        if (import3.checkBinding(throwOnChange, this._expr_19, currVal_19)) {
            this.renderer.setText(this._text_6, currVal_19);
            this._expr_19 = currVal_19;
        }
    };
    View_AppComponent0.prototype.destroyInternal = function () {
        this._vc_8.destroyNestedViews();
        this._vc_10.destroyNestedViews();
        this._RouterOutlet_10_5.ngOnDestroy();
    };
    View_AppComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 8)) {
            return new View_AppComponent1(this.viewUtils, this, 8, this._anchor_8, this._vc_8);
        }
        return null;
    };
    return View_AppComponent0;
}(import1.AppView));
var View_AppComponent1 = (function (_super) {
    __extends(View_AppComponent1, _super);
    function View_AppComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_AppComponent1, renderType_AppComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_AppComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'button', new import3.InlineArray4(4, 'class', 'log-out', 'type', 'button'), null);
        this._text_1 = this.renderer.createText(this._el_0, 'Sign out', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_0, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_0));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), [disposable_0]);
        return null;
    };
    View_AppComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_AppComponent1.prototype.handleEvent_0 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.logOut() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_AppComponent1;
}(import1.AppView));
//# sourceMappingURL=app.component.ngfactory.js.map