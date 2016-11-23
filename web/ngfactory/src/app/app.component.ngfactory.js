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
import * as import8 from '@angular/core/src/linker/view_container';
import * as import9 from '../../node_modules/@angular/router/src/directives/router_outlet.ngfactory';
import * as import10 from '@angular/router/src/router_outlet_map';
import * as import11 from '@angular/core/src/linker/component_factory_resolver';
import * as import12 from '@angular/router/src/directives/router_outlet';
export var Wrapper_AppComponent = (function () {
    function Wrapper_AppComponent() {
        this._changed = false;
        this.context = new import0.AppComponent();
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
        this._AppComponent_0_3 = new Wrapper_AppComponent();
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
    }
    View_AppComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'a', new import3.InlineArray4(4, 'href', 'https://github.com/Dynatrace/davis-server', 'target', '_blank'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n  ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', new import3.InlineArray4(4, 'id', 'logo', 'src', '/assets/img/Dynatrace_Logo_RGB_CPH_512x92px.png'), null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        this._text_4 = this.renderer.createText(parentRenderNode, '\n\n', null);
        this._el_5 = import3.createRenderElement(this.renderer, parentRenderNode, 'router-outlet', import3.EMPTY_INLINE_ARRAY, null);
        this._vc_5 = new import8.ViewContainer(5, null, this, this._el_5);
        this._RouterOutlet_5_5 = new import9.Wrapper_RouterOutlet(this.parentView.injectorGet(import10.RouterOutletMap, this.parentIndex), this._vc_5.vcRef, this.parentView.injectorGet(import11.ComponentFactoryResolver, this.parentIndex), null);
        this._text_6 = this.renderer.createText(parentRenderNode, '\n\n', null);
        this._el_7 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'id', 'made-in-detroit'), null);
        this._text_8 = this.renderer.createText(this._el_7, 'Made in Detroit', null);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._text_4,
            this._el_5,
            this._text_6,
            this._el_7,
            this._text_8
        ]), null);
        return null;
    };
    View_AppComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import12.RouterOutlet) && (5 === requestNodeIndex))) {
            return this._RouterOutlet_5_5.context;
        }
        return notFoundResult;
    };
    View_AppComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        this._RouterOutlet_5_5.ngDoCheck(this, this._el_5, throwOnChange);
        this._vc_5.detectChangesInNestedViews(throwOnChange);
    };
    View_AppComponent0.prototype.destroyInternal = function () {
        this._vc_5.destroyNestedViews();
        this._RouterOutlet_5_5.ngOnDestroy();
    };
    return View_AppComponent0;
}(import1.AppView));
//# sourceMappingURL=app.component.ngfactory.js.map